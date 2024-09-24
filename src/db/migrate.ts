import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from ".";
import { reservedRoutes } from "./schema";

// (async () => {
//   await migrate(db, { migrationsFolder: "./migrations" });
//   client.close();
// })();

// give the unique route names that are reserved for the portfolio
const initialReservedRoutes = [
  "about-me",
  "about-us",
  "contact-me",
  "admin",
  "api",
  "login",
  "logout",
  "register",
  "settings",
  "profile",
  "dashboard",
  "portfolio",
  "projects",
  "blog",
  "contact",
  "resume",
  "login",
  "logout",
  "register",

  // potential usernames
  "utkarsh-seth",
  "utkarshseth",
  "reactwithutkarsh",
  "seth",
  "utk",
  "prakhar-seth",
  "prakhar",

  // Authentication and user management
  "admin",
  "login",
  "logout",
  "register",
  "signup",

  // Add these routes specific to your project
  "create-portfolio",
  "sign-in",
  "sign-up",
  "magic-link",
  "verify-email",
  "reset-password",
  "github",
  "google",
  "callback",
  "generate",
];

async function populateReservedRoutes() {
  for (const routeName of initialReservedRoutes) {
    await db.insert(reservedRoutes).values({ routeName }).onConflictDoNothing();
  }
}

// populateReservedRoutes();

import { heroSection } from "@/db/schema";
import { sql } from "drizzle-orm";

async function updateAvatarOptions() {
  // Fetch all hero sections
  const heroSections = await db.select().from(heroSection).all();

  for (const section of heroSections) {
    const { id, fullName, avatarOptions } = section;

    // Ensure avatarOptions is a string before parsing
    let options =
      typeof avatarOptions === "string" ? JSON.parse(avatarOptions) : {};

    // Update the seed to the full name and set flip to true if not already set
    options.seed = fullName;
    if (options.flip === undefined) {
      options.flip = true;
    }

    // Update the record in the database
    await db
      .update(heroSection)
      .set({ avatarOptions: sql`${JSON.stringify(options)}` })
      .where(sql`${heroSection.id} = ${id}`);
  }

  console.log("Avatar options updated successfully.");
}

updateAvatarOptions().catch((error) => {
  console.error("Error updating avatar options:", error);
});