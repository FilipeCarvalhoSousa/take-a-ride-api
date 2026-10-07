import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),

  PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(3000),

  DATABASE_HOST: z.string().min(1),

  DATABASE_PORT: z.coerce
    .number()
    .int()
    .positive()
    .default(5432),

  DATABASE_NAME: z.string().min(1),

  DATABASE_USER: z.string().min(1),

  DATABASE_PASSWORD: z.string().min(1),
});