"use server";

import { db } from "@/db";
import { User, accounts, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { UserId } from "@/use-cases/types";
import { getAccountByUserId } from "@/data-access/accounts";
import { redis } from "@/utils/redis/redis-config";
import { USERS_CACHE_KEY } from "@/actions/cache_keys";
import { multiTierFetch } from "@/utils/redis/redisFetch";
import { invalidateCache } from "@/utils/redis/cacheUtils";

const ITERATIONS = 10000;
const MAGIC_LINK_TOKEN_TTL = 1000 * 60 * 5; // 5 min

export async function deleteUser(userId: UserId) {
  const cacheKey = `${USERS_CACHE_KEY}:${userId}`;

  // Delete user from the database
  await db.delete(users).where(eq(users.id, userId));
  // Invalidate the cache
  await invalidateCache(cacheKey);
}

export async function getUser(userId: UserId) {
  const cacheKey = `${USERS_CACHE_KEY}:${userId}`;

  const user = await multiTierFetch(cacheKey, () =>
    db.query.users.findFirst({
      where: eq(users.id, userId),
    }),
  );

  return user;
}

async function hashPassword(plainTextPassword: string, salt: string) {
  return new Promise<string>((resolve, reject) => {
    crypto.pbkdf2(
      plainTextPassword,
      salt,
      ITERATIONS,
      64,
      "sha512",
      (err, derivedKey) => {
        if (err) reject(err);
        resolve(derivedKey.toString("hex"));
      },
    );
  });
}

export async function createUser(email: string) {
  const [user] = await db
    .insert(users)
    .values({
      email,
    })
    .returning();

  // Invalidate the cache
  const cacheKey = `${USERS_CACHE_KEY}:${user.id}`;
  await invalidateCache(cacheKey);
  await invalidateCache(USERS_CACHE_KEY);

  return user;
}

export async function createMagicUser(email: string) {
  let userId = null;
  const cacheKey = `${USERS_CACHE_KEY}:${userId}`;
  const [user] = await db
    .insert(users)
    .values({
      email,
      emailVerified: new Date(),
    })
    .returning();

  await db
    .insert(accounts)
    .values({
      userId: user.id,
      accountType: "email",
    })
    .returning();
  userId = user.id;

  // Invalidate the cache
  await invalidateCache(cacheKey);

  return user;
}

export async function verifyPassword(email: string, plainTextPassword: string) {
  const user = await getUserByEmail(email);

  if (!user) {
    return false;
  }

  const account = await getAccountByUserId(user.id);

  if (!account) {
    return false;
  }

  const salt = account.salt;
  const savedPassword = account.password;

  if (!salt || !savedPassword) {
    return false;
  }

  const hash = await hashPassword(plainTextPassword, salt);
  return account.password == hash;
}

export async function getUserByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function getMagicUserAccountByEmail(email: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  return user;
}

export async function setEmailVerified(userId: UserId) {
  const cacheKey = `${USERS_CACHE_KEY}:${userId}`;
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.id, userId));

  // Invalidate the cache
  await invalidateCache(cacheKey);
}

export async function updateUser(userId: UserId, updatedUser: Partial<User>) {
  const cacheKey = `${USERS_CACHE_KEY}:${userId}`;
  await db.update(users).set(updatedUser).where(eq(users.id, userId));
  // Invalidate the cache
  await invalidateCache(cacheKey);
}
