"use client"

import { UseQueryResult, useQuery } from "@tanstack/react-query"

import Main from "@/components/ui/Main"
import PlaylistCard from "./playlist-card"
import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getAllPlaylists } from "@/server_actions/playlist_action"
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB"

const Page = () => {

    const playlists = useQuery({
        queryKey: ["play-lists"], queryFn: async () => (await getAllPlaylists())?.data
    }) as UseQueryResult<getUserPlayListsReturnType>

    return (
        <Main className="flex-1">
            <div className="grid md:grid-cols-4 gap-3">
                {playlists.data ? playlists.data.map((playlist, index) => (
                    <PlaylistCard key={index} playlist={playlist} />
                )) :
                    <>
                        {Array(6).fill(null).map((e, index) => (
                            <PlaylistCardSkeleton key={index}/>
                        ))}
                    </>
                }
            </div>
        </Main>
    )
}

export default Page


const PlaylistCardSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (

        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
            <Skeleton className="w-full h-[15rem]" />
            <Skeleton className="h-5 w-[70%] " />
            <Skeleton className="h-5 w-20 " />
        </div>
    ))

PlaylistCardSkeleton.displayName = "PlaylistCardSkeleton"
