CREATE TABLE `donations` (
	`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_name` TEXT NOT NULL,
	`phone_no` TEXT NOT NULL,
	`email` TEXT NOT NULL,
	`created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,  -- Adjusted for SQLite
	`amount` INTEGER NOT NULL,
	`status` TEXT NOT NULL,
	`payment_id` TEXT,
	`payment_method` TEXT NOT NULL
);

--> statement-breakpoint
/*
 SQLite does not support "Set default to column" out of the box, we do not generate automatic migration for that, so it has to be done manually
 Please refer to: https://www.techonthenet.com/sqlite/tables/alter_table.php
                  https://www.sqlite.org/lang_altertable.html
                  https://stackoverflow.com/questions/2083543/modify-a-columns-type-in-sqlite3

 Due to that we don't generate migration automatically and it has to be done manually
*/