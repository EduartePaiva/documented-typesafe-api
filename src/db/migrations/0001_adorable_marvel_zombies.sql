PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`done` integer DEFAULT false NOT NULL,
	`updatedAt` integer,
	`createdAt` integer
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "name", "done", "updatedAt", "createdAt") SELECT "id", "name", "done", "updatedAt", "createdAt" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;