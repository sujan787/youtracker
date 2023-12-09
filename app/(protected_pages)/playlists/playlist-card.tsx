import * as React from "react"

import {
    Card,
    CardContent,
    CardFooter,
} from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from "@/components/ui/dialog"
import { UseQueryResult, useQuery } from "@tanstack/react-query"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { GetUserVideosReturnType } from "@/services/video_service.DB"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB"
import { getVideos } from "@/server_actions/video_action"

interface PlaylistCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    playlist: getUserPlayListsReturnType[0],
}

const PlaylistCard = React.forwardRef<HTMLDivElement, PlaylistCardProps>(({ playlist, className, ...props }, ref) => {

    const playlistVideos = useQuery({
        queryKey: [`playlistVideos-${playlist.id}`],
        queryFn: async () => (await getVideos({ playlist_id: playlist.id }, 4))?.data
    }) as UseQueryResult<GetUserVideosReturnType>

    return playlistVideos.data?.length ? (
        <Card ref={ref} className={cn("w-full flex flex-col gap-2 overflow-hidden p-3", className)} {...props}>
            <CardContent className="p-0 grid grid-cols-2 gap-1">
                {playlistVideos.data.map((video, index) => (
                    <Image
                        key={index}
                        src={video?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                        alt={video?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                        placeholder="blur"
                        blurDataURL={video?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                        height={100}
                        width={500}
                        className="rounded object-cover" />
                ))}

                {(!!playlistVideos.data.length && playlistVideos.data.length < 4)
                    && Array(4 - playlistVideos.data.length).fill(null).map((e, index) => (
                        <Image
                            key={index}
                            src={playlistVideos.data[0]?.thumbnails?.standard?.url?? "https://github.com/shadcn.png"}
                            alt={playlistVideos.data[0]?.thumbnails?.standard?.url?? "https://github.com/shadcn.png"}
                            placeholder="blur"
                            blurDataURL={playlistVideos.data[0]?.thumbnails?.standard?.url?? "https://github.com/shadcn.png"}
                            height={100}
                            width={500}
                            className="rounded object-cover"
                        />
                    ))
                }
            </CardContent>

            {/* <CardFooter className="flex-col items-start py-0 px-0">
                <p className=" text-muted-foreground">{playlist.name}</p>
            </CardFooter> */}
        </Card>

    ) : (<div>have no video</div>)
})

PlaylistCard.displayName = "PlaylistCard"

export default PlaylistCard


const PlaylistCardSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (

        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
            <Skeleton className="w-full h-[15rem]" />
            <Skeleton className="h-5 w-[70%] " />
            <Skeleton className="h-5 w-20 " />
        </div>
    ))

PlaylistCardSkeleton.displayName = "PlaylistCardSkeleton"

