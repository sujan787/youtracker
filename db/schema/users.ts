import { mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("user", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password"),
    emailVerified: timestamp("emailVerified", { mode: "date", fsp: 3 }),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date", fsp: 3, }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date", fsp: 3 }).defaultNow()
});
