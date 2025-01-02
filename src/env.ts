import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { z, ZodError } from "zod";

expand(config());

const DEFAULT_LEVELS = [
    "trace",
    "debug",
    "info",
    "warn",
    "error",
    "fatal",
] as const;

const EnvSchema = z.object({
    NODE_ENV: z.enum(["development", "production"]),
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
