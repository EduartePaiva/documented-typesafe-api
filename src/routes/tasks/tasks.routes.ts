import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";

import { insertTasksSchema, selectTasksSchema } from "@/db/schema";

const tags = ["Tasks"];

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

const ParamSchema = z.object({
    id: z.coerce.number().openapi({
        param: {
            name: "id",
            in: "path",
            example: 123456,
        },
    }),
});

export const getOne = createRoute({
    path: "/tasks/{id}",
    method: "get",
    request: {
        params: ParamSchema,
    },
    tags,
    responses: {
        [HttpStatusCodes.OK]: jsonContent(
            selectTasksSchema
            , "The selected task",
        ),
    },
});
export type GetOne = typeof getOne;
export type CreateRoute = typeof create;
export type ListRoute = typeof list;
