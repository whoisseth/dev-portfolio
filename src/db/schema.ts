import { AvatarOptions } from "@/app/[route-name]/_components/hero/_components/avatar-editor";
import { sql } from "drizzle-orm";
import { integer, text, sqliteTableCreator } from "drizzle-orm/sqlite-core";

export const accountTypeEnum = ["email", "google", "github"] as const;

// const sqliteTable = sqliteTableCreator((name) => `app_${name}`);
const sqliteTable = sqliteTableCreator((name) => `${name}`);

export const users = sqliteTable("user", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").unique(),
  emailVerified: integer("email_verified", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const accounts = sqliteTable("accounts", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  accountType: text("account_type", { enum: accountTypeEnum }).notNull(),
  githubId: text("github_id").unique(),
  googleId: text("google_id").unique(),
  password: text("password"),
  salt: text("salt"),
});
// no need for this
export const magicLinks = sqliteTable("magic_links", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  email: text("email").notNull().unique(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});
// no need for this
export const resetTokens = sqliteTable("reset_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});
// no need for this
export const verifyEmailTokens = sqliteTable("verify_email_tokens", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  token: text("token"),
  tokenExpiresAt: integer("token_expires_at", { mode: "timestamp" }).notNull(),
});

export const profiles = sqliteTable("profile", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .unique()
    .notNull(),
  displayName: text("display_name"),
  imageId: text("image_id"),
  image: text("image"),
  bio: text("bio").notNull().default(""),
});

export const sessions = sqliteTable("session", {
  id: text("id").primaryKey(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

//  my tables //
// *********************//

export const routes = sqliteTable("routes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  routeName: text("route_name").notNull().unique(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});
export const heroSection = sqliteTable("hero_section", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  tagline: text("tagline"),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  fullName: text("full_name").notNull(),
  description: text("description").notNull(),
  email: text("email").notNull(),
  // skills shoudle be arra
  skills: text("skills", { mode: "json" })
    .$type<string[]>()
    .default(sql`(json_array())`),
  // skills: text("skills"),
  phoneNumber: text("phone_number"),
  linkedIn: text("linkedin"),
  github: text("github"),
  youtube: text("youtube"),
  personalLinks: text("personal_links", { mode: "json" })
    .$type<{ name: string; url: string }[]>()
    .default(sql`(json_array())`),
  avatarOptions: text("avatar_options", { mode: "json" })
    .$type<AvatarOptions>()
    .default(sql`(json_object())`),
  // avatarOptions: text("avatar_options", { mode: "json" })
  //   .$type<AvatarOptions>()
  //   .default(sql`(json_object('seed', fullName, 'flip', true))`),
  routeId: integer("route_id", { mode: "number" })
    .references(() => routes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

export const projects = sqliteTable("projects", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  routeId: integer("route_id", { mode: "number" })
    .references(() => routes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  cloudinaryPublicId: text("cloudinary_public_id"),
  tags: text("tags", { mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
  liveLink: text("live_link"),
  codeLink: text("code_link"),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

// work experience
// routeId

export const workExperiences = sqliteTable("work_experiences", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  routeId: integer("route_id", { mode: "number" })
    .references(() => routes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  jobTitle: text("job_title").notNull(),
  companyName: text("company_name").notNull(),
  location: text("location").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date"),
  isPresent: integer("is_present", { mode: "boolean" }).notNull(),
  jobDescription: text("job_description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updatedAt: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

// reserved routes
export const reservedRoutes = sqliteTable("reserved_routes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  routeName: text("route_name").notNull().unique(),
});

// not using this this in our app
export const projectImages = sqliteTable("project_images", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  projectId: integer("project_id", { mode: "number" })
    .references(() => projects.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
  routeId: integer("route_id", { mode: "number" })
    .references(() => routes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  url: text("url").notNull(),
  created_at: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  updated_at: integer("updated_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
});

// Define your 'images' table
export const images = sqliteTable("images", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  url: text("url").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  routeId: integer("route_id", { mode: "number" })
    .references(() => routes.id, {
      onDelete: "cascade",
    })
    .notNull(),
  userId: integer("user_id", { mode: "number" })
    .references(() => users.id, {
      onDelete: "cascade",
    })
    .notNull(),
});
export const donations = sqliteTable("donations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),

  userName: text("user_name").notNull(),
  phoneNo: text("phone_no").notNull(),
  email: text("email").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).default(
    sql`CURRENT_TIMESTAMP`,
  ),
  amount: integer("amount").notNull(),
  status: text("status").notNull(),
  paymentId: text("payment_id"),
  paymentMethod: text("payment_method").notNull(),
});

export type Donation = typeof donations.$inferSelect;
export type NewDonation = typeof donations.$inferInsert;

export type Image = typeof images.$inferSelect;
export type NewImage = typeof images.$inferInsert;

export type ReservedRoute = typeof reservedRoutes.$inferSelect;
export type User = typeof users.$inferSelect;
export type Profile = typeof profiles.$inferSelect;
export type HeroSection = typeof heroSection.$inferInsert;
export type Project = typeof projects.$inferInsert;

export type UserRoute = typeof routes.$inferSelect;
export type WorkExperience = typeof workExperiences.$inferInsert;
//

//
export type ProjectImage = typeof projectImages.$inferSelect;
export type NewProjectImage = typeof projectImages.$inferInsert;
