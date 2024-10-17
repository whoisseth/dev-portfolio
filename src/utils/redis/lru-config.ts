import { LRUCache } from "lru-cache";

// Configure LRU cache
export const lru = new LRUCache<string, any>({
  max: 1000, // Maximum number of items to store in the cache
  ttl: 1000 * 60 * 5, // Time to live in milliseconds (5 minutes)
});
