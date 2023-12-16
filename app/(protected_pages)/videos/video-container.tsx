"use client"

import * as React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import AudioCard from "./audio-card"
import { GetUserVideosReturnType } from "@/services/video_service.DB"
import VideoCard from "./video-card"
import VideoCardSkeleton from "./video-card-skeleton"
import VideoLoader from "./video-loader";
import { VideoSearchInput } from "@/type"
import { cn } from "@/lib/utils"
import { getVideos } from "@/server_actions/video_action"
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { useGlobalState } from "../../../components/hooks/use-global-state"
import { useInfiniteQuery } from "@tanstack/react-query"
import { useIntersection } from "@mantine/hooks"

interface VideoContainerProps extends
    React.HTMLAttributes<HTMLDivElement> {
}

export type AudioType = {
    identifier: string,
    url: string,
    thumbnail: string,
    title: string,
    channel_title: string
}

const VideoContainer = React.forwardRef<HTMLDivElement, VideoContainerProps>(
    ({ className, children, ...props }, ref) => {
        const [data] = useGlobalState<VideoSearchInput>("search_items")

        const videosQuery = useInfiniteQuery({
            queryKey: ["videos", `${data.keyword}-${data.playlist_id}`],
            queryFn: async ({ pageParam = 1 }) => {
                return (await getVideos({ ...data, pagination: pageParam }))?.data
            },
            getNextPageParam: (_, allPages) => allPages.length + 1,
        })

        const videos: GetUserVideosReturnType = videosQuery.data?.pages ?
            [].concat(...videosQuery.data.pages) : [];

        let audioLists = videos.map((video) => {
            if (!video?.download_sources?.audio_sources[0]) return;
            return {
                identifier: video.id,
                url: `${video.download_sources?.audio_sources[0].url}&uuid=${video.id}`,
                thumbnail: video?.thumbnails?.maxres?.url || video?.thumbnails?.standard?.url,
                title: video.title,
                channel_title: video.channel_title
            }
        }) as Array<AudioType>

        audioLists = audioLists.filter((d) => !!d)

        const lastVideoRef = React.useRef<HTMLElement>(null)

        const interaction = useIntersection({
            root: lastVideoRef.current,
            threshold: 1
        })

        React.useEffect(() => {
            if (interaction.entry?.isIntersecting) videosQuery.fetchNextPage();
        }, [interaction.entry])

        const [parent, enable] = useAutoAnimate()

        return (
            <div ref={ref} className={cn("h-full flex flex-col justify-between", className)}{...props}>
                <Tabs defaultValue="video" className="w-full flex justify-center items-center flex-col gap-2">
                    <TabsList className="grid grid-cols-2">
                        <TabsTrigger value="video" >Youtube</TabsTrigger>
                        <TabsTrigger value="audio">Audio</TabsTrigger>
                    </TabsList>

                    {videosQuery.isLoading ? <div className="grid md:grid-cols-4 gap-5 pb-10 w-full">
                        {Array(6).fill({}).map((e, index) => (
                            <VideoCardSkeleton key={index} />
                        ))}
                    </div> : <>
                        <TabsContent value="video" className="w-full">
                            <div className="grid md:grid-cols-4 gap-5 pb-10" ref={parent}>
                                {
                                    videos.map((info, index) => {
                                        return (index === videos.length - 1) ?
                                            (info && <VideoCard info={info} key={index} ref={interaction.ref} />) :
                                            (info && <VideoCard info={info} key={index} />)
                                    })
                                }
                            </div>
                        </TabsContent>

                        <TabsContent value="audio" className="w-full">
                            <div className="grid md:grid-cols-4 gap-5 pb-10" ref={parent}>
                                {
                                    audioLists.map((audio, index) => {
                                        return (index === videos.length - 1) ?
                                            (audio && <AudioCard info={audio} audioLists={audioLists} key={index} ref={interaction.ref} />) :
                                            (audio && <AudioCard info={audio} audioLists={audioLists} key={index} />)
                                    })
                                }
                            </div>
                        </TabsContent>
                    </>}
                </Tabs>

                <VideoLoader isLoading={videosQuery.isFetchingNextPage} />
            </div>
        )
    })

VideoContainer.displayName = "VideoContainer"

export default VideoContainer


