import { pgTable, serial, timestamp, varchar } from "drizzle-orm/pg-core";

export const playlistVideos = pgTable("playlist_videos", {
    id: serial("id").primaryKey(),
    playlist_id: varchar("playlist_id", { length: 255 }),
    video_id: varchar("video_id", { length: 255 }),
    created_at: timestamp("created_at", { mode: "date"}).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date"}).defaultNow(),
});
