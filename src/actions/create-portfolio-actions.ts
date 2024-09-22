"use server";

import { db } from "@/db";
import {
  heroSection,
  HeroSection,
  Project,
  projects,
  reservedRoutes,
  routes,
} from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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
export const addProject = async (projectData: Project) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const newProject = await db
    .insert(projects)
    .values({
      ...projectData,
      userId: user.id,
    })
    .returning();

  revalidatePath("/");
  return newProject[0];
};

// create a function to get getProjects with routeName

// export const getProjects = async (routeName: string) => {
//   const userProjects = await db
//     .select()
//     .from(projects)
//     .innerJoin(routes, eq(projects.routeId, routes.id))
//     .where(eq(routes.routeName, routeName))
//     .get();

//   return userProjects;
// };

// ... existing code ...

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
      linkLink: projects.liveLink,
      routeId: projects.routeId,
      codeLink: projects.codeLink,
    })
    .from(projects)
    .innerJoin(routes, eq(projects.routeId, routes.id))
    .where(eq(routes.routeName, routeName));

  return userProjects;
};

// ... existing code ...

export const updateProject = async (projectData: Project) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!projectData.id) {
    throw new Error("Project ID is required for updating");
  }

  // Check if the project belongs to the current user
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectData.id))
    .get();

  if (!existingProject || existingProject.userId !== user.id) {
    throw new Error("You do not have permission to update this project");
  }

  const updatedProject = await db
    .update(projects)
    .set({
      title: projectData.title,
      description: projectData.description,
      imageUrl: projectData.imageUrl,
      tags: projectData.tags,
      liveLink: projectData.liveLink,
      codeLink: projectData.codeLink,
    })
    .where(eq(projects.id, projectData.id))
    .returning();

  revalidatePath("/");
  return updatedProject[0];
};

// ... existing code ...

// ... existing code ...

// title: string;
// userId: number;
// description: string;
// routeId: number;
// id?: number | undefined;
// imageUrl?: string | null | undefined;
// tags?: string[] | undefined;
// liveLink?: string | null | undefined;
// codeLink?:
