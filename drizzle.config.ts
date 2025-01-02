import { defineConfig } from "drizzle-kit";

import env from "@/env";

export default defineConfig({
    schema: "./src/db/schema.ts",
    out: "./src/db/migrations",
    dialect: "sqlite",
    dbCredentials: {
        url: env.DATABASE_URL,
        token: env.DATABASE_AUTH_TOKEN,
    },
    casing: "snake_case",
});