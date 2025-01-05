import { config } from "dotenv";
import { expand } from "dotenv-expand";
import path from "node:path";
import { z, ZodError } from "zod";

expand(config({
    path: path.resolve(
        process.cwd(),
        // eslint-disable-next-line node/no-process-env
        process.env.NODE_ENV === "test" ? ".env.test" : ".env",
    ),
}));

const DEFAULT_LEVELS = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
    "silent",
] as const;

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]),
    LOG_LEVEL: z.enum(DEFAULT_LEVELS),
    PORT: z.coerce.number().default(9999),
    DATABASE_URL: z.string().url(),
    DATABASE_AUTH_TOKEN: z.string().optional(),
}).superRefine((input, ctx) => {
    if (input.NODE_ENV === "production" && input.DATABASE_AUTH_TOKEN === undefined) {
        ctx.addIssue({
            code: z.ZodIssueCode.invalid_type,
            expected: "string",
            received: "undefined",
            path: ["DATABASE_AUTH_TOKEN"],
            message: "Must be set when NODE_ENV is production",
        });
    }
});
// eslint-disable-next-line node/no-process-env
const parsedData = EnvSchema.safeParse(process.env);
if (!parsedData.success) {
    console.error("❌ Invalid env:");
    console.error(parsedData.error.flatten().fieldErrors);
    process.exit(1);
}
const env = parsedData.data;
export default env;
