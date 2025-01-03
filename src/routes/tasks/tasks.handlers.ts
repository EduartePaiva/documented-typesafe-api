import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { tasks } from "@/db/schema";

import type { CreateRoute, ListRoute } from "./tasks.routes";

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
