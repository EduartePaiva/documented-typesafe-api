import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    done: integer({ mode: "boolean" }).notNull().default(false),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);
