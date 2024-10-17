"use server";

import { redis } from "./redis-config";
import { lru } from "./lru-config";

export const invalidateCache = async (key: string): Promise<void> => {
  lru.delete(key);
  try {
    await redis.del(key);
  } catch (error) {
    console.error("Error invalidating Redis cache:", error);
  }
};

export const updateDataAndCache = async <T>(
  key: string,
  updateFunction: () => Promise<T>,
): Promise<T> => {
  // Update the data in the database
  const updatedData = await updateFunction();

  // Invalidate the cache
  await invalidateCache(key);

  // Update both caches with the new data
  lru.set(key, updatedData);
  await redis.set(key, JSON.stringify(updatedData));

  return updatedData;
};
