import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
	DATABASE_URL: z.string({
		invalid_type_error: "DATABASE_URL type must `string`",
		required_error: "DATABASE_URL must be `required`"
	}),
	PORT: z.preprocess((x) => +(x as string), z.number())
});

const env = envSchema.parse(process.env);
export default env;
