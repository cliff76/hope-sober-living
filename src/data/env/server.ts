import {createEnv} from "@t3-oss/env-nextjs";
import {z} from "zod";

console.log('server.ts: process.env', process.env);
console.log('server.ts: creating server .env...');
export const env = createEnv({
    server: {
        DB_PASSWORD: z.string().min(1),
        DB_USER: z.string().min(1),
        DB_HOSTNAME: z.string().min(1),
        DB_PORT: z.string().min(1),
        DB_NAME: z.string().min(1),
        DB_DISABLE_SSL: z.string().min(1).optional(),
    },
    createFinalSchema: env => {
        console.log('server.ts: transforming .env vars...');
        return z.object(env).transform(val => {
            const { DB_PASSWORD, DB_USER, DB_HOSTNAME, DB_PORT, DB_NAME, DB_DISABLE_SSL, ...rest } = val;
            const noSSL = (DB_DISABLE_SSL && (DB_DISABLE_SSL.toLowerCase() === 'true' || DB_DISABLE_SSL.toLowerCase() === 'yes'))
            return {
                ...rest,
                DATABASE_URL: `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOSTNAME}:${DB_PORT}/${DB_NAME}${noSSL ? '' : '?sslmode=require'}`
            }
        })
    },
    emptyStringAsUndefined: true,
    experimental__runtimeEnv: process.env
})