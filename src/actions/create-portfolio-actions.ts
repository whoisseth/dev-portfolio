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
