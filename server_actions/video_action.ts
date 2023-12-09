"use server"

import { AddVideoFormInput, ServerActionReturnType, VideoSearchInput } from "@/type"
import { AddVideoParamsType, addPlaylistVideos, getVideoByVideoId } from './../services/video_service.DB';
import { fetchYoutubeVideoInfo, getYoutubeDownloadSources } from "@/services/youtube_api_service"

import { addPlaylist } from "@/services/playlist_service.DB";
import { addVideo as addVideoIntoDB } from './../services/video_service.DB';
import { getUserVideos } from './../services/video_service.DB';

export const saveVideo = async (data: AddVideoFormInput)
    : ServerActionReturnType => {

    let video;

    try {
        const videoId = await extractYouTubeVideoId(data.url)
        const matchVideo = await getVideoByVideoId(videoId)
        const videoInfo = !matchVideo ? await fetchYoutubeVideoInfo(videoId) : undefined;

        const dataObject: AddVideoParamsType = {
            url: matchVideo?.url ?? data.url,
            youtube_video_id: matchVideo?.youtube_video_id ?? videoId,
            title: matchVideo?.title ?? videoInfo?.items[0].snippet.title,
            description: matchVideo?.description ?? videoInfo?.items[0].snippet.description,
            thumbnails: matchVideo?.thumbnails ?? videoInfo?.items[0].snippet.thumbnails,
            channel_title: matchVideo?.channel_title ?? videoInfo?.items[0].snippet.channelTitle,
            tags: matchVideo?.tags ?? videoInfo?.items[0].snippet.tags,
            download_sources: matchVideo?.download_sources ?? await getYoutubeDownloadSources(data.url),
            published_at: matchVideo?.published_at ?? new Date(videoInfo?.items[0]?.snippet?.publishedAt || "")
        }

        video = await addVideoIntoDB(dataObject)

        if (data.playlist_id && video?.id) {
            await addPlaylistVideos(video.id, data.playlist_id)
        }

        if (data.playlist_name && video?.id) {
            const playlist = await addPlaylist({ name: data.playlist_name })
            await addPlaylistVideos(video.id, playlist.id)
        }
    } catch (error: any) {
        console.log(error.message)
        return { is_ok: false, message: { error: error.message ?? "Internal server Error" } }
    }

    return { is_ok: true, message: { success: "Video has been saved" }, data: video }
}

export const getVideos = async (params: VideoSearchInput & { pagination?: number }, limit = 16)
    : ServerActionReturnType => {
    const videos = await getUserVideos(params, limit)
    return { is_ok: true, data: videos }
}

// * helper functions

export async function extractYouTubeVideoId(url: string)
    : Promise<string> {
    let id

    try {
        id = new URL(url).searchParams.get("v")
        id = id ?? new URL(url).pathname.split("/")?.[1]
    } catch (error) { }

    if (!id) throw new Error("Url don't have any video id")

    return id ?? ""
}
