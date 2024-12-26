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
    PORT: z.coerce.number().default(999),
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
