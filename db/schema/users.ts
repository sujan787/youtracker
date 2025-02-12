import { pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
    id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    password: text("password"),
    emailVerified: timestamp("emailVerified", { mode: "date" }).defaultNow(),
    image: varchar("image", { length: 255 }),
    createdAt: timestamp("created_at", { mode: "date" }).defaultNow(),
    updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow()
});
