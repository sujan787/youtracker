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
} from "../../../components/ui/dialog"

import { AspectRatio } from "../../../components/ui/aspect-ratio"
import { GetUserVideosReturnType } from "@/services/video_service.DB"
import Image from "next/image"
import { cn } from "@/lib/utils"

interface VideoCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    info: GetUserVideosReturnType[0],
}

const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(({ info, className, ...props }, ref) => {

    const thumbnail = info?.thumbnails?.maxres?.url || info?.thumbnails?.standard?.url || "https://github.com/shadcn.png"

    return (
        <Dialog>
            <DialogTrigger className="">
                <Card ref={ref} className={cn("w-full flex flex-col gap-2 border-none overflow-hidden shadow-none", className)} {...props}>
                    <CardContent className="p-0">
                        <Image
                            src={thumbnail}
                            alt={thumbnail}
                            placeholder="blur"
                            blurDataURL={thumbnail}
                            height={100}
                            width={400}
                            className="rounded object-cover transition duration-200 ease-in transform sm:hover:scale-105" />
                    </CardContent>
                    <CardFooter className="flex-col items-start py-2 px-1">
                        <p className=" text-start">{info.title ? info.title.substring(0, 40) : "No Title Found"}</p>
                        <small className=" text-muted-foreground">{info.channel_title}</small>
                    </CardFooter>
                </Card>
            </DialogTrigger>
            <DialogContent className="w-full p-1 rounded-md" >
                <AspectRatio ratio={16 / 9}>
                    <iframe
                        src={`https://www.youtube.com/embed/${info.video_id}?rel=0`}
                        title="YouTube video" allowFullScreen
                        className="w-full h-full rounded-md"></iframe>
                </AspectRatio>
            </DialogContent>
        </Dialog>
    )
})

VideoCard.displayName = "VideoCard"

export default VideoCard



