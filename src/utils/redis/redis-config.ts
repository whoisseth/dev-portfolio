import { env } from "@/env";
import Redis from "ioredis";

const redisOptions = {
  lazyConnect: true,
  showFriendlyErrorStack: true,
  enableAutoPipelining: true,
  maxRetriesPerRequest: 0,
  retryStrategy: (times: number) => {
    if (times > 3) {
      throw new Error(`[Redis] Could not connect after ${times} attempts`);
    }
    return Math.min(times * 200, 1000);
  },
};

export const redis = new Redis(env.REDIS_URL, redisOptions);

redis.on("error", (error: unknown) => {
  console.warn("[Redis] Error connecting", error);
});
