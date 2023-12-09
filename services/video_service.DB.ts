"use server"

import { UserType, VideoSearchInput } from "@/type";
import { and, desc, eq, like } from "drizzle-orm";

import { DownloadSourceType } from "./youtube_api_service";
import { authOptions } from "@/lib/auth";
import { db } from "@/db"
import { getServerSession } from "next-auth";
import { playlistVideos } from "@/db/schema/playlist_videos";
import { videos } from "@/db/schema/videos"

export type AddVideoParamsType = {
    url: string,
    youtube_video_id?: string,
    title?: string,
    description?: string,
    thumbnails?: ThumbnailsType,
    channel_title?: string,
    tags?: Array<string>,
    published_at?: Date,
    download_sources?: DownloadSourceType
}

export type ThumbnailsType = {
    "default": {
        "url": string,
        "width": number,
        "height": number
    },
    "medium": {
        "url": string,
        "width": number,
        "height": number
    },
    "high": {
        "url": string,
        "width": number,
        "height": number
    },
    "standard": {
        "url": string,
        "width": number,
        "height": number
    },
    "maxres": {
        "url": string,
        "width": number,
        "height": number
    }
}

export const addVideo = async (data: AddVideoParamsType) => {
    const session = await getServerSession(authOptions) as { user: UserType };
    const videoId = crypto.randomUUID();
    // console.log(data);
    
    try {
        await db.insert(videos).values({ id: videoId, ...data, user_id: session.user.id })
    } catch (error) {
        console.log(error)
        throw new Error("vide can not be inserted")
    }

    return await getVideoById(videoId)
}

export const getVideoByVideoId = async (videoId: string,) => {
    const session = await getServerSession(authOptions) as { user: UserType };

    return (await db.query.videos.findFirst({
        where: and(eq(videos.user_id, session.user.id), eq(videos.youtube_video_id, videoId))
    }))
}

export const getVideoById = async (id: string) => {
    return await db.query.videos.findFirst({
        where: eq(videos.id, id),
        orderBy: desc(videos.created_at)
    })
}

export const addPlaylistVideos = async (videId: string, playlistId: string) => {
    try {
        await db.insert(playlistVideos).values({ video_id: videId, playlist_id: playlistId })
    } catch (error) {
        throw new Error("vide can not be inserted into the playlists")
    }

    return true
}

export const getUserVideos =
    async (filterableParams: VideoSearchInput & { pagination?: number }, limit: number = 10) => {
        const pagination = filterableParams?.pagination ?? 1
        const offset = (pagination - 1) * limit;
        const session = await getServerSession(authOptions) as { user: UserType };
        const keyword = filterableParams.keyword ?? ""

        let sq = db.select({
            id: videos.id,
            url: videos.url,
            video_id: videos.youtube_video_id,
            title: videos.title,
            thumbnails: videos.thumbnails,
            channel_title: videos.channel_title,
            tags: videos.tags,
            created_at: videos.created_at,
            playlist_id: playlistVideos.playlist_id,
            user_id: videos.user_id,
            download_sources: videos.download_sources
        }).from(videos)
            .leftJoin(playlistVideos, eq(videos.id, playlistVideos.video_id)).as('sq')

        if (filterableParams.playlist_id) {
            sq = db.select().from(sq)
                .where(eq(sq.playlist_id, filterableParams.playlist_id))
                .as("sq") as any;
        }

        const results = await db.select().from(sq).where(and(
            eq(sq.user_id, session.user.id),
            like(sq.title, `%${keyword}%`),
        )).limit(limit).offset(offset).orderBy(desc(sq.created_at));

        return results
    }

export type GetUserVideosReturnType = Awaited<ReturnType<typeof getUserVideos>>