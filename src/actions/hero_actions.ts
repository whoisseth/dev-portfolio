"use server";

import { AvatarOptions } from "@/app/[route-name]/_components/hero/_components/avatar-editor";
import { db } from "@/db";
import { heroSection, HeroSection, routes } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { multiTierFetch } from "@/utils/redis/redisFetch";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateCache } from "@/utils/redis/cacheUtils";

const HERO_SECTIONS_CACHE_KEY = "hero_sections";

// GET
export const getHeroSectionData = async (routeName: string) => {
  const cacheKey = `${HERO_SECTIONS_CACHE_KEY}:${routeName}`;

  try {
    const heroSectionData = await multiTierFetch(cacheKey, () =>
      db
        .select()
        .from(heroSection)
        .innerJoin(routes, eq(heroSection.routeId, routes.id))
        .where(eq(routes.routeName, routeName))
        .get(),
    );
    return heroSectionData;
  } catch (error) {
    console.error("Error fetching from Redis:", error);
    throw error;
  }
};

// POST
export const addHeroSection = async (d: HeroSection, routeName: string) => {
  const cacheKey = `${HERO_SECTIONS_CACHE_KEY}:${routeName}`;

  const user = await getCurrentUser();
  if (!user) {
    throw new Error("User not authenticated");
  }
  await db.insert(heroSection).values({
    ...d,
  });
  // Invalidate the cache
  await invalidateCache(cacheKey);
  revalidatePath("/");
};

// PUT
export const updateHeroSection = async (d: HeroSection, routeName: string) => {
  const cacheKey = `${HERO_SECTIONS_CACHE_KEY}:${routeName}`;

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

  // Invalidate the cache
  await invalidateCache(cacheKey);
  revalidatePath("/");
};

// PUT
export const updateAvatarOptions = async (
  userId: number,
  avatarOptions: AvatarOptions,
  routeName: string,
) => {
  const cacheKey = `${HERO_SECTIONS_CACHE_KEY}:${routeName}`;

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

  // Invalidate the cache
  await invalidateCache(cacheKey);
  revalidatePath("/");
};
