"use server";

import { AvatarOptions } from "@/app/[route-name]/_components/hero/_components/avatar-editor";
import { db } from "@/db";
import {
  Donation,
  donations,
  heroSection,
  HeroSection,
  images,
  Layout,
  layout,
  NewDonation,
  Project,
  projects,
  reservedRoutes,
  routes,
  users,
  WorkExperience,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { workExperiences } from "@/db/schema";
import { projectImages, NewProjectImage } from "@/db/schema";
import { LayoutStyle } from "@/app/[route-name]/_components/work-experience-section";
import { HeroLayoutStyle } from "@/app/[route-name]/_components/hero";
import { ProjectLayoutStyle } from "@/app/[route-name]/_components/projects-section";

export const addHeroSection = async (d: HeroSection) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db.insert(heroSection).values({
    ...d,
  });
  revalidatePath("/");
};

export const addRoute = async (d: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const lowercaseRouteName = d.toLowerCase();

  const isAvailable = await checkRouteAvailability(lowercaseRouteName);
  if (!isAvailable) {
    throw new Error("Route name is already taken or reserved");
  }

  const route = await db
    .insert(routes)
    .values({
      routeName: lowercaseRouteName,
      userId: user.id,
    })
    .returning();
  revalidatePath("/");
  return route;
};

// check route availability
export const checkRouteAvailability = async (routeName: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const lowercaseRouteName = routeName.toLowerCase();

  const route = await db
    .select()
    .from(routes)
    .where(sql`LOWER(${routes.routeName}) = ${lowercaseRouteName}`)
    .get();

  const reservedRoute = await db
    .select()
    .from(reservedRoutes)
    .where(sql`LOWER(${reservedRoutes.routeName}) = ${lowercaseRouteName}`)
    .get();

  return !route && !reservedRoute;
};

// ... existing code ...

export const getUserRoute = async (userId: number | null) => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  if (userId) {
    const route = await db
      .select({
        routeName: routes.routeName,
        routeId: routes.id,
        userId: routes.userId,
      })
      .from(routes)
      .where(eq(routes.userId, userId))
      .get();
    return route;
  }
  return null;
};

// ... existing code ...

//
export const getHeroSectionData = async (routeName: string) => {
  const heroSectionData = await db
    .select()
    .from(heroSection)
    .innerJoin(routes, eq(heroSection.routeId, routes.id))
    .where(eq(routes.routeName, routeName))
    .get();
  return heroSectionData;
};

export const updateHeroSection = async (d: HeroSection) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (d.id === undefined) {
    throw new Error("HeroSection id is undefined");
  }

  // Check if the hero section belongs to the current user
  const heroSectionData = await db
    .select()
    .from(heroSection)
    .innerJoin(routes, eq(heroSection.routeId, routes.id))
    .where(eq(heroSection.id, d.id))
    .get();

  if (!heroSectionData || heroSectionData.routes.userId !== user.id) {
    throw new Error("You do not have permission to update this hero section");
  }

  await db.update(heroSection).set(d).where(eq(heroSection.id, d.id));
  revalidatePath("/");
};

export const canEditPortfolio = async (routeName: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) {
    return false; // User is not logged in
  }

  const portfolio = await db
    .select()
    .from(routes)
    .where(eq(routes.routeName, routeName))
    .get();

  // Check if portfolio exists and belongs to the current user
  return !!portfolio && portfolio.userId === user.id;
};

// Update route name
export const updateRouteName = async (
  oldRouteName: string,
  newRouteName: string,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  console.log(`Attempting to update route: ${oldRouteName} to ${newRouteName}`);

  // Check if the old route exists and belongs to the user
  const existingRoute = await db
    .select()
    .from(routes)
    .where(eq(routes.routeName, oldRouteName))
    .get();

  if (!existingRoute) {
    console.log(`Route not found: ${oldRouteName}`);
    throw new Error(`Route not found: ${oldRouteName}`);
  }

  if (existingRoute.userId !== user.id) {
    console.log(`User does not own the route: ${oldRouteName}`);
    throw new Error("You do not have permission to update this route");
  }

  // Check if the new route name is available
  const isAvailable = await checkRouteAvailability(newRouteName);
  if (!isAvailable) {
    console.log(`New route name is already taken or reserved: ${newRouteName}`);
    throw new Error("The new route name is already taken or reserved");
  }

  // Update the route
  const updatedRoute = await db
    .update(routes)
    .set({ routeName: newRouteName })
    .where(eq(routes.routeName, oldRouteName))
    .returning();

  if (updatedRoute.length === 0) {
    console.log(`Failed to update route: ${oldRouteName}`);
    throw new Error("Failed to update route");
  }

  console.log(`Successfully updated route: ${oldRouteName} to ${newRouteName}`);
  revalidatePath("/");
  return updatedRoute[0];
};

// Add a project to the database
// Add a project to the database
// Add a project to the database
export const addProject = async (
  projectData: Omit<Project, "id" | "cloudinaryPublicId">,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Insert project into database
  const newProject = await db
    .insert(projects)
    .values({
      ...projectData,
    })
    .returning()
    .get();

  revalidatePath("/");
  return newProject;
};

// Get projects associated with a specific route name
export const getProjects = async (routeName: string) => {
  const userProjects = await db
    .select({
      title: projects.title,
      userId: projects.userId,
      description: projects.description,
      id: projects.id,
      imageUrl: projects.imageUrl,
      tags: projects.tags,
      liveLink: projects.liveLink,
      routeId: projects.routeId,
      codeLink: projects.codeLink,
    })
    .from(projects)
    .innerJoin(routes, eq(projects.routeId, routes.id))
    .where(eq(routes.routeName, routeName));

  return userProjects;
};

// ... existing code ...

export const updateProject = async (
  projectId: number,
  projectData: Partial<Project>,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .get();

  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("You do not have permission to update this project");
  }
  if (existingProject.imageUrl) {
    await db.delete(images).where(eq(images.url, existingProject.imageUrl));
  }

  // Update project in database
  const updatedProject = await db
    .update(projects)
    .set(projectData)
    .where(eq(projects.id, projectId))
    .returning()
    .get();

  revalidatePath("/");
  return updatedProject;
};

// create a fuction to delete a project
export const deleteProject = async (projectId: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .get();
  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("You do not have permission to delete this project");
  }
  if (existingProject.imageUrl) {
    await db.delete(images).where(eq(images.url, existingProject.imageUrl));
  }
  await db.delete(projects).where(eq(projects.id, projectId));
  revalidatePath("/");
};

// create a function to get all users with get a Full Name from heroSection , and get routeName from routes table without login
export const getAllUsers = async () => {
  const allUsers = await db
    .select({
      // sno: sql<number>`ROW_NUMBER() OVER (ORDER BY ${routes.createdAt} DESC)`,
      sno: sql<number>`ROW_NUMBER() OVER (ORDER BY ${routes.createdAt} ASC)`,
      fullName: heroSection.fullName,
      routeName: routes.routeName,
      avatarOptions: heroSection.avatarOptions,
    })
    .from(heroSection)
    .innerJoin(routes, eq(heroSection.routeId, routes.id))
    .orderBy(desc(routes.createdAt)); // Use the column reference with .desc() method
  return allUsers;
};

export const updateAvatarOptions = async (
  userId: number,
  avatarOptions: AvatarOptions,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if the hero section belongs to the current user
  const heroSectionData = await db
    .select()
    .from(heroSection)
    .innerJoin(routes, eq(heroSection.routeId, routes.id))
    .where(eq(heroSection.userId, userId))
    .get();

  if (!heroSectionData || heroSectionData.routes.userId !== user.id) {
    throw new Error("You do not have permission to update this hero section");
  }

  await db
    .update(heroSection)
    .set({ avatarOptions })
    .where(eq(heroSection.userId, userId));
  revalidatePath("/");
};

// work experience section

// get work experience data in descending order of start date

export const getWorkExperiences = async (routeName: string) => {
  const userWorkExperiences = await db
    .select({
      id: workExperiences.id,
      userId: workExperiences.userId,
      routeId: workExperiences.routeId,
      jobTitle: workExperiences.jobTitle,
      companyName: workExperiences.companyName,
      location: workExperiences.location,
      startDate: workExperiences.startDate,
      endDate: workExperiences.endDate,
      isPresent: workExperiences.isPresent,
      jobDescription: workExperiences.jobDescription,
    })
    .from(workExperiences)
    .innerJoin(routes, eq(workExperiences.routeId, routes.id))
    .where(eq(routes.routeName, routeName))
    .orderBy(desc(workExperiences.startDate));

  return userWorkExperiences;
};

export const addWorkExperience = async (workExperienceData: WorkExperience) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const newWorkExperience = await db
    .insert(workExperiences)
    .values({
      ...workExperienceData,
      userId: user.id,
    })
    .returning();

  revalidatePath("/");
  return newWorkExperience[0];
};

export const updateWorkExperience = async (
  workExperienceData: WorkExperience,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!workExperienceData.id) {
    throw new Error("Work Experience ID is required for updating");
  }

  const existingWorkExperience = await db
    .select()
    .from(workExperiences)
    .where(eq(workExperiences.id, workExperienceData.id))
    .get();

  if (!existingWorkExperience || existingWorkExperience.userId !== user.id) {
    throw new Error(
      "You do not have permission to update this work experience",
    );
  }

  const updatedWorkExperience = await db
    .update(workExperiences)
    .set({
      jobTitle: workExperienceData.jobTitle,
      companyName: workExperienceData.companyName,
      location: workExperienceData.location,
      startDate: workExperienceData.startDate,
      endDate: workExperienceData.endDate,
      isPresent: workExperienceData.isPresent,
      jobDescription: workExperienceData.jobDescription,
    })
    .where(eq(workExperiences.id, workExperienceData.id))
    .returning();

  revalidatePath("/");
  return updatedWorkExperience[0];
};

export const deleteWorkExperience = async (workExperienceId: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const existingWorkExperience = await db
    .select()
    .from(workExperiences)
    .where(eq(workExperiences.id, workExperienceId))
    .get();
  if (!existingWorkExperience || existingWorkExperience.userId !== user.id) {
    throw new Error(
      "You do not have permission to delete this work experience",
    );
  }

  await db
    .delete(workExperiences)
    .where(eq(workExperiences.id, workExperienceId));
  revalidatePath("/");
};

export const addDonation = async (donationData: NewDonation) => {
  await db.insert(donations).values(donationData);
  revalidatePath("/");
};

//  get and update layout
type LayoutStyleUpdate = {
  heroSectionLayoutStyle?: Layout["heroSectionLayoutStyle"];
  projectLayoutStyle?: Layout["projectLayoutStyle"];
  workExperienceLayoutStyle?: Layout["workExperienceLayoutStyle"];
};

export const getLayoutStyle = async (routeName: string) => {
  const layoutStyle = await db
    .select()
    .from(layout)
    .innerJoin(routes, eq(layout.routeId, routes.id))
    .where(eq(routes.routeName, routeName))
    .get();
  return layoutStyle;
};

export const updateLayoutStyle = async (
  routeId: number,
  styleUpdate: LayoutStyleUpdate,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Check if a layout entry exists for this route
  let existingLayout = await db
    .select()
    .from(layout)
    .where(eq(layout.routeId, routeId))
    .get();

  if (!existingLayout) {
    // If no layout exists, create a new one with the provided style(s)
    existingLayout = await db
      .insert(layout)
      .values({
        routeId,
        userId: user.id,
        ...styleUpdate,
      })
      .returning()
      .get();
  } else {
    // If layout exists, update only the provided style(s)
    await db.update(layout).set(styleUpdate).where(eq(layout.routeId, routeId));
  }

  revalidatePath("/");
  return existingLayout;
};
