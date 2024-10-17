"use server";

import { db } from "@/db";
import { workExperiences, routes, WorkExperience } from "@/db/schema";
import { getCurrentUser } from "@/lib/session";
import { multiTierFetch } from "@/utils/redis/redisFetch";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { invalidateCache } from "@/utils/redis/cacheUtils";

const WORK_EXPERIENCES_CACHE_KEY = "workExperiences";

// GET
export const getWorkExperiences = async (routeName: string) => {
  const cacheKey = `${WORK_EXPERIENCES_CACHE_KEY}:${routeName}`;
  const userWorkExperiences = await multiTierFetch(
    cacheKey,
    () =>
      db
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
        .orderBy(desc(workExperiences.startDate)),
    // { forceRefresh: false },
  );

  return userWorkExperiences;
};

export const addWorkExperience = async (
  workExperienceData: WorkExperience,
  routeName: string,
) => {
  const cacheKey = `${WORK_EXPERIENCES_CACHE_KEY}:${routeName}`;
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

  // Invalidate the cache
  await invalidateCache(cacheKey);
  revalidatePath("/");

  return newWorkExperience[0];
};

export const updateWorkExperience = async (
  workExperienceData: WorkExperience,
  routeName: string,
) => {
  const cacheKey = `${WORK_EXPERIENCES_CACHE_KEY}:${routeName}`;

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
    .where(eq(workExperiences.id, workExperienceData.id!))
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
    .where(eq(workExperiences.id, workExperienceData.id!))
    .returning();

  // Invalidate the cache
  await invalidateCache(cacheKey);

  revalidatePath("/");
  return updatedWorkExperience[0];
};

export const deleteWorkExperience = async (
  workExperienceId: number,
  routeName: string,
) => {
  const cacheKey = `${WORK_EXPERIENCES_CACHE_KEY}:${routeName}`;
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

  // Invalidate the cache
  await invalidateCache(cacheKey);

  revalidatePath("/");
};
