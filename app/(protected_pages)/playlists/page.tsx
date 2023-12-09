"use client"

import { UseQueryResult, useQuery } from "@tanstack/react-query"

import Main from "@/components/ui/Main"
import PlaylistCard from "./playlist-card"
import { getAllPlaylists } from "@/server_actions/playlist_action"
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB"

const Page = () => {

    const playlists = useQuery({
        queryKey: ["play-lists"], queryFn: async () => (await getAllPlaylists())?.data
    }) as UseQueryResult<getUserPlayListsReturnType>

    return (
        <Main className="flex-1">
            <div className="grid md:grid-cols-4">
                {playlists.data && playlists.data.map((playlist, index) => (
                    <PlaylistCard key={index} playlist={playlist} />
                ))}
            </div>
        </Main>
    )
}

export default Page