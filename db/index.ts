import * as dotenv from "dotenv";

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

import schema from "./schema";

dotenv.config();

const poolConnection = mysql.createPool({
    user: `${process.env.DATABASE_USERNAME}`,
    password: `${process.env.DATABASE_PASSWORD}`,
    host: `${process.env.DATABASE_HOST}`,
    port: 25386,
    database: `${process.env.DATABASE_NAME}`,
});


export const db = drizzle(poolConnection, { schema: schema });