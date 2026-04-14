// src/config/env.config.ts
import { z } from 'zod';

export const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().default(3000),
    // DB Config
    DB_HOST: z.string(),
    DB_PORT: z.coerce.number().default(5432),
    DB_USER: z.string(),
    DB_PASSWORD: z.string(),
    DB_NAME: z.string(),
    // Auth Config
    JWT_SECRET: z.string(),
    API_KEY_SYSTEM: z.string(), // Una key maestra o secreta
});

export type EnvConfig = z.infer<typeof envSchema>;