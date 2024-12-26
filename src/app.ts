import type { Env } from "hono";
import type { PinoLogger } from "hono-pino";

import { OpenAPIHono } from "@hono/zod-openapi";
import { logger } from "hono/logger";
import { notFound, onError } from "stoker/middlewares";

import { pinoLogger } from "./middlewares/pino-logger";

interface AppBindings {
    Variables: {
        logger: PinoLogger;
    };
}

const app = new OpenAPIHono<AppBindings>();
app.use(pinoLogger());
app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/error", (c) => {
    c.var.logger.info("wow log here!");
    c.var.logger.debug("only visible when debug is on");
    throw new Error("Oh no!");
});

app.notFound(notFound);
app.onError(onError);

export default app;
