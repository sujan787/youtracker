import { int, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core";

export const playlistVideos = mysqlTable("playlist_videos", {
    id: int('id').primaryKey().autoincrement(),
    playlist_id: varchar("playlist_id", { length: 255 }),
    video_id: varchar("video_id", { length: 255 }),
    created_at: timestamp("created_at", { mode: "date", fsp: 3 }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date", fsp: 3 }).defaultNow(),
});
