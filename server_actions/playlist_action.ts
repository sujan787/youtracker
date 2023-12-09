"use server"

import { ServerActionReturnType } from "@/type";
import { getUserPlayLists } from "@/services/playlist_service.DB";

export const getAllPlaylists = async (): ServerActionReturnType => {
    const playLists = await getUserPlayLists()
    return { is_ok: true, data: playLists };
}
