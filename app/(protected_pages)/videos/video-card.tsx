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
import { cn } from "@/lib/utils"

interface VideoCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    info: GetUserVideosReturnType[0],
}

const VideoCard = React.forwardRef<HTMLDivElement, VideoCardProps>(({ info, className, ...props }, ref) => {

    const thumbnail = info?.thumbnails?.maxres?.url || info?.thumbnails?.standard?.url || "https://github.com/shadcn.png"

    return (
        <Dialog>

            <Card ref={ref} className={cn("w-full flex flex-col gap-2 border-none overflow-hidden shadow-none", className)} {...props}>
                <DialogTrigger>
                    <CardContent className="p-0 relative">
                        <Image
                            src={thumbnail}
                            alt={thumbnail}
                            placeholder="blur"
                            blurDataURL={thumbnail}
                            height={100}
                            width={400}
                            className="rounded object-cover transition duration-200 ease-in transform sm:hover:scale-105" />
                    </CardContent>
                </DialogTrigger>
                <CardFooter className="flex justify-between items-center">
                    <div className="flex-col items-start py-2 px-1">
                        <p className=" text-start">{info.title ? info.title.substring(0, 40) : "No Title Found"}</p>
                        <small className=" text-muted-foreground">{info.channel_title}</small>
                    </div>
                    <Actions className="" />
                </CardFooter>
            </Card>

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

interface ActionProps extends
    React.HtmlHTMLAttributes<HTMLDivElement> {

}

const Actions = React.forwardRef<HTMLDivElement, ActionProps>(({ className, ...props }, ref) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className={cn("", className)}>
                <CgMenuGridR size={25} />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem>
                    <Link href="/download" className="flex items-center gap-1"><IoMdDownload/>Download</Link>
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-400 flex gap-1"><MdDelete/>Delete</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
})

Actions.displayName = "Actions"

