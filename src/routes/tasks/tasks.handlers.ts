import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { tasks } from "@/db/schema";

import type { CreateRoute, GetOneRoute, ListRoute } from "./tasks.routes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
    const tasks = await db.query.tasks.findMany();

    return c.json(tasks);
};

export const create: AppRouteHandler<CreateRoute> = async (c) => {
    const user = await db
        .insert(tasks)
        .values(c.req.valid("json"))
        .returning();
    return c.json(user[0], HttpStatusCodes.OK);
};

export const getOne: AppRouteHandler<GetOneRoute> = async (c) => {
    const task = await db
        .select()
        .from(tasks)
        .where(eq(tasks.id, c.req.valid("param").id));

    if (task.length === 0) {
        return c.json({
            message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
        }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(task[0], HttpStatusCodes.OK);
};
