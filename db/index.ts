import * as dotenv from "dotenv";

import { connect } from "@planetscale/database";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import schema from "./schema";

dotenv.config();


// create the connection
const connection = connect({
    url: process.env.DATABASE_URL
});

export const db = drizzle(connection, { schema: schema });
