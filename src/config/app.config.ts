// src/config/app.config.ts
import { registerAs } from '@nestjs/config';
import { envSchema } from './env.config';

export default registerAs('config', () => {
    // Validamos process.env contra el esquema
    const result = envSchema.safeParse(process.env);

    if (!result.success) {
        console.error('❌ Invalid environment variables:', result.error.format());
        throw new Error('Invalid environment variables');
    }

    return result.data;
});