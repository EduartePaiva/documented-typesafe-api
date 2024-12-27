import createApp from "@/lib/create-app";

const app = createApp();

app.get("/", (c) => {
    return c.text("Hello Hono!");
});

app.get("/error", (c) => {
    c.var.logger.info("wow log here!");
    c.var.logger.debug("only visible when debug is on");
    throw new Error("Oh no!");
});

export default app;
