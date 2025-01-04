import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const tasks = sqliteTable("tasks", {
    id: integer({ mode: "number" }).primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    done: integer({ mode: "boolean" }).notNull().default(false),
    updatedAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()).$onUpdate(() => new Date()),
    createdAt: integer({ mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const selectTasksSchema = createSelectSchema(tasks);
export const insertTasksSchema = createInsertSchema(
    tasks,
    {
        name: schema => schema.min(2).max(500),
    },
).omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const patchTasksSchema = insertTasksSchema.partial()