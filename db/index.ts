import { drizzle, PostgresJsDatabase } from "drizzle-orm/postgres-js"
import postgres from 'postgres';
import schema from "./schema/index"

const DB_URL = process.env.DATABASE_URL;

const connection = postgres(`${DB_URL}`)

export const db: PostgresJsDatabase<typeof schema> = drizzle(connection, { schema })
