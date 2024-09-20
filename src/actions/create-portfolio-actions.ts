"use server";

import { db } from "@/db";
import { heroSection, HeroSection, routes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
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
  const route = await db
    .insert(routes)
    .values({
      routeName: d,
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

  const route = await db
    .select()
    .from(routes)
    .where(eq(routes.routeName, routeName))
    .get();

  // If the result is undefined, the username doesn't exist
  return !route;
};

export const getUserRoute = async (userId: number | null) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (userId) {
    const route = await db
      .select()
      .from(routes)
      .where(eq(routes.userId, userId))
      .get();
    return route?.routeName;
  }
};

// create a function to get the aboutMe data with the help of routeName
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

// create a function to update the routeName
export const updateRouteName = async (
  routeId: number,
  newRouteName: string,
) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db
    .update(routes)
    .set({ routeName: newRouteName })
    .where(eq(routes.id, routeId));
  revalidatePath("/");
};

// create a function that will check user is login and its their portfolio or not and return the portfolio true or false

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
