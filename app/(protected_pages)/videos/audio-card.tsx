import 'react-h5-audio-player/lib/styles.css';

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

import AudioPlayer from 'react-h5-audio-player';
import { AudioType } from './video-container';
import Image from "next/image"
import { TfiHeadphone } from "react-icons/tfi";
import { cn } from "@/lib/utils"

interface AudioCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    info: AudioType,
    audioLists: Array<AudioType>
}

const AudioCard = React.forwardRef<HTMLDivElement, AudioCardProps>(
    ({ info, audioLists, className, ...props }, ref) => {

        const [activeAudio, setActiveAudio] = React.useState<AudioType>()

        React.useEffect(() => {
            setActiveAudio((e) => {
                return audioLists.filter((e) => e.identifier == info.identifier)[0]
            })
        }, [])

        const handleNextAudio = () => {
            console.log("hello")
            setActiveAudio((e) => {
                const index = audioLists.findIndex((e) => e.identifier == activeAudio?.identifier)
                if (index + 1 < audioLists.length) {
                    return audioLists[index + 1];
                }
                return e;
            })
        }

        const handlePrevAudio = () => {
            setActiveAudio((e) => {
                const index = audioLists.findIndex((e) => e.identifier == activeAudio?.identifier)
                if (index != 0) {
                    return audioLists[index - 1];
                }
                
                return e;
            })
        }

        return (
            <Dialog>
                <DialogTrigger className="">
                    <Card ref={ref} className={cn("w-full flex flex-col gap-2 border-none overflow-hidden shadow-none", className)} {...props}>
                        <CardContent className="p-0">
                            <AudioThumbnail thumbnail={activeAudio?.thumbnail} />
                        </CardContent>
                        <CardFooter className="flex-col items-start py-2 px-1">
                            <p className=" text-start">{activeAudio?.title ? activeAudio?.title.substring(0, 40) : "No Title Found"}</p>
                            <small className=" text-muted-foreground">{activeAudio?.channel_title}</small>
                        </CardFooter>
                    </Card>
                </DialogTrigger>
                <DialogContent className="w-full p-1 rounded-md" >
                    <div className='relative'>
                        <AudioThumbnail thumbnail={activeAudio?.thumbnail} />
                        <AudioPlayer
                            className=' absolute z-10 bottom-0 bg-transparent text-primary'
                            autoPlayAfterSrcChange
                            showDownloadProgress
                            src={activeAudio?.url}
                            showSkipControls
                            onPlay={e => console.log("onPlay")}
                            onEnded={() => handleNextAudio()}
                            onClickNext={() => handleNextAudio()}
                            onClickPrevious={() => handlePrevAudio()}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        )
    })

AudioCard.displayName = "AudioCard"

export default AudioCard


interface AudioThumbnailProps extends
    React.HTMLAttributes<HTMLDivElement> {
    thumbnail?: string,
}

const AudioThumbnail = React.forwardRef<HTMLDivElement, AudioThumbnailProps>(
    ({ thumbnail, className, ...props }, ref) => {
        thumbnail = thumbnail || "https://github.com/shadcn.png"
        return (
            <div ref={ref} className={cn("relative", className)}{...props}>
                <Image
                    src={thumbnail}
                    alt={thumbnail}
                    placeholder="blur"
                    blurDataURL={thumbnail}
                    height={100}
                    width={600}
                    className="rounded object-cover transition duration-200 ease-in transform sm:hover:scale-105" />

                <div className=" absolute top-0 bottom-0 right-0 left-0 z-10 bg-blur-rgba backdrop-blur-[3px] px-7 py-5 bg-opacity-60
                        flex justify-center items-center">
                    <div className="p-1 border-[2px] rounded-full">
                        <div className="p-2 rounded-full bg-muted border-[4px]">
                            <TfiHeadphone size={30} className=" text-muted-foreground" />
                        </div>
                    </div>
                </div>
            </div>
        )
    })

AudioThumbnail.displayName = "AudioThumbnail"
