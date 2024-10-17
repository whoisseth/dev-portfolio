"use server";

import { cache } from "react";
import { redis } from "./redis-config";
import { lru } from "./lru-config";

// using lru cache and redis cache
export const multiTierFetch = async <T>(
  key: string,
  fetcher: () => Promise<T>,
  options: {
    redisTtl?: number; // TTL for Redis cache in seconds
    lruTtl?: number; // TTL for LRU cache in milliseconds
    forceRefresh?: boolean; // Flag to force a refresh of the data
  } = {},
): Promise<T> => {
  const {
    redisTtl = 300,
    lruTtl = 1000 * 60 * 5,
    forceRefresh = false,
  } = options;

  if (!forceRefresh) {
    // Check LRU cache first
    const lruCachedData = lru.get(key) as T | undefined;
    if (lruCachedData) {
      return lruCachedData;
    }

    try {
      // Check Redis cache
      const redisCachedData = await redis.get(key);
      if (redisCachedData !== null) {
        const parsedData = JSON.parse(redisCachedData) as T;
        // Store in LRU cache
        lru.set(key, parsedData, { ttl: lruTtl });
        return parsedData;
      }
    } catch (error) {
      console.error("Error fetching from Redis:", error);
    }
  }

  // Fetch fresh data
  const freshData = await fetcher();

  // Store in both caches
  try {
    await redis.set(key, JSON.stringify(freshData), "EX", redisTtl);
    lru.set(key, freshData, { ttl: lruTtl });
  } catch (error) {
    console.error("Error setting data in caches:", error);
  }

  return freshData;
};

// using react cache and redis cache
const multiTierFetch_old = cache(
  async <T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl = 300, // Default TTL of 5 minutes
  ): Promise<T> => {
    try {
      const cachedData = await redis.get(key);
      if (cachedData !== null) {
        return JSON.parse(cachedData) as T;
      }
    } catch (error) {
      console.error("Error fetching from Redis:", error);
    }

    const freshData = await fetcher();

    try {
      await redis.set(key, JSON.stringify(freshData), "EX", ttl);
    } catch (error) {
      console.error("Error setting data in Redis:", error);
    }

    return freshData;
  },
);
