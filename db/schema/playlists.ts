import { pgTable, timestamp, varchar } from "drizzle-orm/pg-core";

import { relations } from 'drizzle-orm';
import { users } from "./users";

export const playlists = pgTable("playlists", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    user_id: varchar("user_id", { length: 255 }).notNull(),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const playlistsRelations = relations(playlists, ({ one }) => ({
    user: one(users, {
        fields: [playlists.user_id],
        references: [users.id]
    })
}));
