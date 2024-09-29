CREATE TABLE `accounts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`account_type` text NOT NULL,
	`github_id` text,
	`google_id` text,
	`password` text,
	`salt` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `hero_section` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`tagline` text,
	`user_id` integer NOT NULL,
	`full_name` text NOT NULL,
	`description` text NOT NULL,
	`email` text NOT NULL,
	`skills` text,
	`phone_number` text,
	`linkedin` text,
	`github` text,
	`youtube` text,
	`personal_links` text DEFAULT (json_array()),
	`avatar_options` text DEFAULT (json_object()),
	`route_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `magic_links` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`display_name` text,
	`image_id` text,
	`image` text,
	`bio` text DEFAULT '' NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`route_id` integer NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`image-url` text,
	`tags` text DEFAULT (json_array()) NOT NULL,
	`live-link` text,
	`code-link` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `reserved_routes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`route_name` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reset_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `routes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`route_name` text NOT NULL,
	`user_id` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` integer NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `user` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`email` text,
	`email_verified` integer,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `verify_email_tokens` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`token` text,
	`token_expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `work_experiences` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`route_id` integer NOT NULL,
	`job_title` text NOT NULL,
	`company_name` text NOT NULL,
	`location` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`is_present` integer NOT NULL,
	`job_description` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP,
	`updated_at` integer DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`route_id`) REFERENCES `routes`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_user_id_unique` ON `accounts` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_github_id_unique` ON `accounts` (`github_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_google_id_unique` ON `accounts` (`google_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `magic_links_email_unique` ON `magic_links` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `profile_user_id_unique` ON `profile` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reserved_routes_route_name_unique` ON `reserved_routes` (`route_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `reset_tokens_user_id_unique` ON `reset_tokens` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `routes_route_name_unique` ON `routes` (`route_name`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE UNIQUE INDEX `verify_email_tokens_user_id_unique` ON `verify_email_tokens` (`user_id`);