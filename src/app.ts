import createApp from "@/lib/create-app";
import index from "@/routes/index.route";
import tasks from "@/routes/tasks/tasks.index";

import configureOpenAPI from "./lib/configure-open-api";

const app = createApp();

const routes = [
    index,
    tasks,
];
configureOpenAPI(app);
routes.forEach(route => app.route("/", route));

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/error", (c) => {
    c.var.logger.info("wow log here!");
    c.var.logger.debug("only visible when debug is on");
    throw new Error("Oh no!");
});

export default app;
