import "dotenv/config";
import { migrate } from "drizzle-orm/libsql/migrator";
import { client, db } from ".";
import { reservedRoutes, routes, users } from "./schema";

(async () => {
  try {
    await migrate(db, { migrationsFolder: "./migrations" });
    client.close();
    console.log("Successfully Migrated");
  } catch (error) {
    console.log("Failed to Migrate", error);
  }
})();

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
