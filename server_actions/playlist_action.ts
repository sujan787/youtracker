"use server"

import { AddPlaylistParamType, getUserPlayLists } from "@/services/playlist_service.DB";

import { ServerActionReturnType } from "@/type";
import { deletePlaylist as deletePlaylistFromDb } from "@/services/playlist_service.DB";
import { deletePlaylistVideos } from "@/services/video_service.DB";
import { updatePlaylist as updatePlaylistToDb } from "@/services/playlist_service.DB";

export const getAllPlaylists = async (): ServerActionReturnType => {
    const playLists = await getUserPlayLists()
    return { is_ok: true, data: playLists };
}

export const updatePlaylist = async (playlistId: string, data: AddPlaylistParamType)
    : ServerActionReturnType => {
    try {
        await updatePlaylistToDb(playlistId, data)
    } catch (error) {
        return { is_ok: false, message: { error: "Failed to update the playlist." } }
    }

    return { is_ok: true, message: { success: "Playlist has been successfully updated" } }
}

export const deletePlaylist = async (playlistId: string): ServerActionReturnType => {
    try {
        await deletePlaylistVideos(playlistId);
        await deletePlaylistFromDb(playlistId);
    } catch (error) {
        return { is_ok: false, message: { error: "Failed to delete the playlists." } }
    }

    return { is_ok: true, message: { success: "Video has been successfully deleted" } }
}  