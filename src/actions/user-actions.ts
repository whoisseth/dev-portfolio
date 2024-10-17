"use server";

import { db } from "@/db";
import { heroSection, routes } from "@/db/schema";
import { multiTierFetch } from "@/utils/redis/redisFetch";
import { desc, eq, sql } from "drizzle-orm";
import { USERS_CACHE_KEY } from "./cache_keys";

// GET
export const getAllUsers = async () => {
  const allUsers = await multiTierFetch(USERS_CACHE_KEY, () =>
    db
      .select({
        sno: sql<number>`ROW_NUMBER() OVER (ORDER BY ${routes.createdAt} ASC)`,
        fullName: heroSection.fullName,
        routeName: routes.routeName,
        avatarOptions: heroSection.avatarOptions,
      })
      .from(heroSection)
      .innerJoin(routes, eq(heroSection.routeId, routes.id))
      .orderBy(desc(routes.createdAt)),
  );

  return allUsers;
};
