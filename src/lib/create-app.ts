import type { Schema } from "hono";

import { OpenAPIHono } from "@hono/zod-openapi";
import { notFound, onError, serveEmojiFavicon } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { pinoLogger } from "@/middlewares/pino-logger";

import type { AppBindings, AppOpenAPI } from "./types";

export function createRouter() {
    return new OpenAPIHono<AppBindings>({ strict: false, defaultHook });
}

function createApp() {
    const app = new OpenAPIHono<AppBindings>({
        strict: false,
    });
    app.use(serveEmojiFavicon("🧻"));
    app.use(pinoLogger());
    app.notFound(notFound);
    app.onError(onError);
    return app;
}

export default createApp;

export function createTestApp<R extends Schema>(router: OpenAPIHono<AppBindings, R>): OpenAPIHono<AppBindings, R> {
    const testApp = createApp();
    testApp.route("/", router);
    return testApp;
}
