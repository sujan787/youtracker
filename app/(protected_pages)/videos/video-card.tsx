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
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Action } from "@radix-ui/react-toast"
import { AspectRatio } from "../../../components/ui/aspect-ratio"
import { CgMenuGridR } from "react-icons/cg";
import { GetUserVideosReturnType } from "@/services/video_service.DB"
import Image from "next/image"
import { IoMdDownload } from "react-icons/io";
import Link from "next/link"
import { MdDelete } from "react-icons/md";
import { VideoSearchInput } from "@/type"
import { cn } from "@/lib/utils"
import { deleteVideo } from "@/server_actions/video_action"
import { useGlobalState } from "@/components/hooks/use-global-state"
import { useQueryClient } from "@tanstack/react-query"
import useToastMessage from "@/components/hooks/use-toast-message"

interface VideoCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    info: GetUserVideosReturnType[0],
}

const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(({ info, className, ...props }, ref) => {

    const thumbnail = info?.thumbnails?.maxres?.url || info?.thumbnails?.standard?.url || "https://github.com/shadcn.png"

    return (
        <Dialog>

            <Card ref={ref} className={cn("group w-full flex flex-col gap-2 border-none overflow-hidden shadow-none bg-transparent", className)} {...props}>
                <DialogTrigger className="cursor-pointer">
                    <CardContent className="p-0 relative overflow-hidden rounded-xl ring-1 ring-border">
                        <Image
                            src={thumbnail}
                            alt={info.title ?? "video thumbnail"}
                            placeholder="blur"
                            blurDataURL={thumbnail}
                            height={100}
                            width={400}
                            className="aspect-video w-full rounded-xl object-cover transition duration-300 ease-out group-hover:scale-105" />
                        <div className="absolute inset-0 rounded-xl bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                    </CardContent>
                </DialogTrigger>
                <CardFooter className="flex justify-between items-start gap-2 py-1 px-1">
                    <div className="flex flex-col items-start min-w-0">
                        <p className="text-start text-sm font-medium leading-snug line-clamp-2">{info.title ? info.title : "No Title Found"}</p>
                        <small className="text-muted-foreground truncate max-w-full">{info.channel_title}</small>
                    </div>
                    <Actions className="shrink-0" info={info} />
                </CardFooter>
            </Card>

            <DialogContent className="w-full p-1 rounded-md" >
                <AspectRatio ratio={16 / 9}>
                    <iframe
                        src={`https://www.youtube.com/embed/${info?.video_id}?rel=0`}
                        title="YouTube video" allowFullScreen
                        className="w-full h-full rounded-md"></iframe>
                </AspectRatio>
            </DialogContent>
        </Dialog>
    )
})

VideoCard.displayName = "VideoCard"

export default VideoCard

interface ActionProps extends
    React.HtmlHTMLAttributes<HTMLDivElement> {
    info: GetUserVideosReturnType[0],
}

const Actions = React.forwardRef<HTMLDivElement, ActionProps>(({ info, className, ...props }, ref) => {
    const [setToasterMessage] = useToastMessage();

    const queryClient = useQueryClient();
    const [data] = useGlobalState<VideoSearchInput>("search_items")

    const deleteVideoById = async (videoId: string) => {
        const status = await deleteVideo(videoId)
        queryClient.invalidateQueries({ queryKey: ["videos"] });
        setToasterMessage(status.message)
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn("text-muted-foreground", className)}>
                <CgMenuGridR size={25} className="mr-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href={`/download?url=${info.url}`} className="flex items-center gap-1"><IoMdDownload />Download</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 flex gap-1" onClick={() => deleteVideoById(info.id)}><MdDelete />Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
})

Actions.displayName = "Actions"

