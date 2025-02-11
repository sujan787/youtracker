import {  json, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

import { DownloadSourceType } from "@/services/youtube_api_service";
import { ThumbnailsType } from "@/services/video_service.DB";
import { relations } from 'drizzle-orm';
import { users } from "./users";

export const videos = pgTable("videos", {
    id: varchar("id", { length: 255 }).notNull().primaryKey(),
    url: varchar("url", { length: 255 }).notNull(),
    youtube_video_id: varchar("youtube_video_id", { length: 255 }),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    thumbnails: json("thumbnails").$type<ThumbnailsType>(),
    channel_title: varchar("channel_title", { length: 255 }),
    tags: json('tags').$type<Array<string>>(),
    published_at: timestamp("published_at", { mode: "date" }).defaultNow(),
    download_sources: json("download_sources").$type<DownloadSourceType>(),
    user_id: varchar("user_id", { length: 255 }),
    created_at: timestamp("created_at", { mode: "date" }).defaultNow(),
    updated_at: timestamp("updated_at", { mode: "date" }).defaultNow(),
});

export const videosRelations = relations(videos, ({ one }) => ({
    user: one(users, {
        fields: [videos.user_id],
        references: [users.id],
    })
}));
