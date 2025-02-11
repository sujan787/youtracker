import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { users } from "./users";

export const sessions = pgTable("session", {
    sessionToken: varchar("sessionToken", { length: 255 }).notNull().primaryKey(),
    userId: varchar("userId", { length: 255 }).notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});