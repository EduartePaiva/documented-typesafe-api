import { testClient } from "hono/testing";
import { execSync } from "node:child_process";
import fs from "node:fs";
import { afterAll, beforeAll, describe, expect, expectTypeOf, it } from "vitest";

import env from "@/env";
import { createTestApp } from "@/lib/create-app";

import router from "./tasks.index";

if (env.NODE_ENV !== "test") {
    throw new Error("NODE_ENV must be 'test'");
}

const client = testClient(createTestApp(router));

describe("tasks list", () => {
    beforeAll(async () => {
        execSync("pnpm drizzle-kit push");
    });

    afterAll(() => {
        fs.rmSync("test.db", { force: true });
    });

    it("responds with an array", async () => {
        const testRouter = createTestApp(router);
        const response = await testRouter.request("/tasks");
        const result = await response.json();
        // @ts-expect-error test
        expectTypeOf(result).toBeArray();
    });

    it("validates the id param", async () => {
        const response = await client.tasks[":id"].$get({
            param: {
                // @ts-expect-error ignore a string type
                id: "wat",
            },
        });

        expect(response.status).toBe(422);
    });
});
