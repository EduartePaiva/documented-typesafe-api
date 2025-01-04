import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "stoker/http-status-phrases";
import { jsonContent, jsonContentOneOf, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertTasksSchema, patchTasksSchema, selectTasksSchema } from "@/db/schema";
import { notFountSchema } from "@/lib/constants";

const tags = ["Tasks"];

const ParamSchema = z.object({
    id: z.coerce.number().openapi({
        param: {
            name: "id",
            in: "path",
            example: 123456,
        },
    }),
});

export const list = createRoute({
    path: "/tasks",
    method: "get",
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            z.array(selectTasksSchema)
            , "The list of tasks",
        ),
    },
});

export const create = createRoute({
    path: "/tasks",
    method: "post",
    request: {
        body: jsonContentRequired(insertTasksSchema, "The task to insert"),
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            selectTasksSchema
            , "The created task",
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(insertTasksSchema),
            "The validation error(s)",
        ),
    },
});

export const patch = createRoute({
    method: "patch",
    path: "/tasks/{id}",
    request: {
        params: ParamSchema,
        body: jsonContentRequired(patchTasksSchema, "The task updates"),
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            selectTasksSchema
            , "The updated task",
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFountSchema,
            "Task not found",
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContentOneOf(
            [createErrorSchema(patchTasksSchema), (createErrorSchema(ParamSchema))],
            "The validation error(s)",
        ),
    },
});

export const getOne = createRoute({
    method: "get",
    path: "/tasks/{id}",
    request: {
        params: ParamSchema,
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            selectTasksSchema
            , "The selected task",
        ),
        [HttpStatusCodes.NOT_FOUND]: jsonContent(
            notFountSchema,
            "Task not found",
        ),
        [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
            createErrorSchema(ParamSchema),
            "Invalid id error",
        ),
    },
});
export type PatchRoute = typeof patch;
export type GetOneRoute = typeof getOne;
export type CreateRoute = typeof create;
export type ListRoute = typeof list;
