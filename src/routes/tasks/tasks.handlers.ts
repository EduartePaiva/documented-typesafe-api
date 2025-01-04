import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusMessage from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";

import db from "@/db";
import { tasks } from "@/db/schema";

import type { CreateRoute, DeleteRoute, GetOneRoute, ListRoute, PatchRoute } from "./tasks.routes";

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
            message: HttpStatusMessage.NOT_FOUND,
        }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(task[0], HttpStatusCodes.OK);
};

export const patch: AppRouteHandler<PatchRoute> = async (c) => {
    const task = await db
        .update(tasks)
        .set(c.req.valid("json"))
        .where(eq(tasks.id, c.req.valid("param").id))
        .returning();

    if (task.length === 0) {
        return c.json({
            message: HttpStatusMessage.NOT_FOUND,
        }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(task[0], HttpStatusCodes.OK);
};
export const remove: AppRouteHandler<DeleteRoute> = async (c) => {
    const result = await db
        .delete(tasks)
        .where(eq(tasks.id, c.req.valid("param").id));

    if (result.rowsAffected === 0) {
        return c.json({ message: HttpStatusMessage.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    return c.body(null, HttpStatusCodes.NO_CONTENT);
};
