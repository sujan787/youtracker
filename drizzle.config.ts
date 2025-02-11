
import { defineConfig } from 'drizzle-kit';

import * as dotenv from "dotenv";
dotenv.config();


export const DB_URL = process.env.DATABASE_URL as string

export default defineConfig({
    schema:  "./db/schema",
    out: "./drizzle",
    dialect: 'postgresql',
    dbCredentials: {
        url: DB_URL as string
    },
    verbose: true,
    strict: true,
});