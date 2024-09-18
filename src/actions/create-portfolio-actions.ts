"use server";

import { db } from "@/db";
import { aboutMe, AboutMe, routes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const addAboutMe = async (d: AboutMe) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db.insert(aboutMe).values({
    ...d,
  });
  revalidatePath("/");
};

// add route fuction
// export const addRoute = async (d: string) => {
//   const user = await getCurrentUser();
//   if (!user) {
//     throw new Error("User not authenticated");
//   }
//   await db.insert(routes).values({
//     routeName: d,
//     userId: user.id,
//   });
//   revalidatePath("/");
// };

export const addRoute2 = async (d: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db
    .insert(routes)
    .values({
      routeName: d,
      userId: user.id,
    })
    .returning();
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

export const getUserRoute = async (userId: number) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const route = await db
    .select()
    .from(routes)
    .where(eq(routes.userId, userId))
    .get();
  return route?.routeName;
};

// create a function to get the aboutMe data with the help of routeName
export const getAboutMeWithRouteName = async (routeName: string) => {
  const aboutMeData = await db
    .select()
    .from(aboutMe)
    .innerJoin(routes, eq(aboutMe.routeId, routes.id))
    .where(eq(routes.routeName, routeName))
    .get();
  return aboutMeData;
};

export const updateAboutMe = async (d: AboutMe) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  if (d.id === undefined) {
    throw new Error("AboutMe id is undefined");
  }
  await db.update(aboutMe).set(d).where(eq(aboutMe.id, d.id));
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
export const checkUserPortfolio = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  const portfolio = await db
    .select()
    .from(routes)
    .where(eq(routes.userId, user.id))
    .get();
  return !!portfolio;
};
