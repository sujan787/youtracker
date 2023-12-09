"use server"

import { ServerActionReturnType } from '@/type';
import { getYoutubeDownloadSources } from '@/services/youtube_api_service';

export const getDownloadSources = async (youtubeUrl: string): ServerActionReturnType => {
    let sources;

    try {
        sources = await getYoutubeDownloadSources(youtubeUrl)
    } catch (error: any) {
        return { is_ok: false, message: { error: error.message ?? "Internal server Error" }, data: sources }
    }

    return { is_ok: true, message: { success: "" }, data: sources }
}
