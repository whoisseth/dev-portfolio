"use server";

import { db } from "@/db";
import { reservedRoutes, routes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { invalidateCache } from "@/utils/redis/cacheUtils";
import { multiTierFetch } from "@/utils/redis/redisFetch";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const ROUTES_CACHE_KEY = "routes";

const CAN_EDIT_PORTFOLIO_CACHE_KEY = "can_edit_portfolio";

// GET
export const getUserRoute = async (userId: number | null) => {
  const cacheKey = `${ROUTES_CACHE_KEY}:${userId}`;

  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  if (userId) {
    const route = await multiTierFetch(cacheKey, () =>
      db
        .select({
          routeName: routes.routeName,
          routeId: routes.id,
          userId: routes.userId,
        })
        .from(routes)
        .where(eq(routes.userId, userId))
        .get(),
    );
    return route;
  }
  return null;
};

// check if route is reserved
// GET
export const checkRouteAvailability = async (routeName: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const lowercaseRouteName = routeName.toLowerCase();

  const isAvailable = await multiTierFetch(
    `${ROUTES_CACHE_KEY}:${user.id}`,
    async () => {
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
    },
  );

  return isAvailable;
};

// check if user can edit portfolio
// GET
export const canEditPortfolio = async (routeName: string): Promise<boolean> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log("canEditPortfolio: User not logged in");
      return false;
    }

    // console.log(
    //   `canEditPortfolio: Checking for route "${routeName}" for user ${user.id}`,
    // );

    const cacheKey = `${CAN_EDIT_PORTFOLIO_CACHE_KEY}:${routeName}:${user.id}`;

    const canEdit = await multiTierFetch(cacheKey, async () => {
      const portfolio = await db
        .select()
        .from(routes)
        .where(eq(routes.routeName, routeName))
        .get();

      if (!portfolio) {
        console.log(`canEditPortfolio: Route "${routeName}" not found`);
        return false;
      }

      const result = portfolio.userId === user.id;
      console.log(
        `canEditPortfolio: Route "${routeName}" belongs to user ${portfolio.userId}, current user ${user.id}, can edit: ${result}`,
      );
      return result;
    });

    return canEdit;
  } catch (error) {
    console.error(`Error in canEditPortfolio for route "${routeName}":`, error);
    return false;
  }
};

// POST
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

  // Invalidate the cache
  const cacheKey = `${ROUTES_CACHE_KEY}:${user.id}`;
  await invalidateCache(cacheKey);
  revalidatePath("/");

  return route;
};

// UPDATE
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

  // Invalidate the cache
  const cacheKey = `${ROUTES_CACHE_KEY}:${user.id}`;
  await invalidateCache(cacheKey);
  const cacheKey2 = `${CAN_EDIT_PORTFOLIO_CACHE_KEY}:${oldRouteName}:${user.id}`;
  await invalidateCache(cacheKey2);
  revalidatePath("/");

  return updatedRoute[0];
};

// DELETE
export const deleteRoute = async (routeName: string) => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const deletedRoute = await db
    .delete(routes)
    .where(eq(routes.routeName, routeName))
    .returning();

  if (deletedRoute.length === 0) {
    throw new Error("Failed to delete route");
  }

  // Invalidate the cache
  const cacheKey = `${ROUTES_CACHE_KEY}:${user.id}`;
  await invalidateCache(cacheKey);
  const cacheKey2 = `${CAN_EDIT_PORTFOLIO_CACHE_KEY}:${routeName}:${user.id}`;
  await invalidateCache(cacheKey2);

  revalidatePath("/");
  return deletedRoute[0];
};
