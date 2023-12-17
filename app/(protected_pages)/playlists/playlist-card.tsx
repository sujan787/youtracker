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
import { UseQueryResult, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { deletePlaylist, updatePlaylist } from "@/server_actions/playlist_action"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Button } from "@/components/ui/button"
import Error from "@/components/ui/error"
import { FaRegEdit } from "react-icons/fa";
import { GetUserVideosReturnType } from "@/services/video_service.DB"
import Image from "next/image"
import { Input } from "@/components/ui/input"
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { IoMdClose } from "react-icons/io";
import Link from "next/link"
import { MdDelete } from "react-icons/md";
import { Skeleton } from "@/components/ui/skeleton"
import SubmitButton from "@/components/ui/submit_button"
import { cn } from "@/lib/utils"
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB"
import { getVideos } from "@/server_actions/video_action"
import { playlistAddSchema } from "@/yup/shema"
import { useForm } from "react-hook-form"
import useToastMessage from "@/components/hooks/use-toast-message"
import { yupResolver } from "@hookform/resolvers/yup"

interface PlaylistCardProps extends
    React.HTMLAttributes<HTMLDivElement> {
    playlist: getUserPlayListsReturnType[0],
}

type PlaylistInput = {
    name: string
}

const PlaylistCard = React.forwardRef<HTMLDivElement, PlaylistCardProps>(({ playlist, className, ...props }, ref) => {
    const [setToasterMessage] = useToastMessage();
    const queryClient = useQueryClient();

    const playlistVideos = useQuery({
        queryKey: [`playlistVideos-${playlist.id}`],
        queryFn: async () => (await getVideos({ playlist_id: playlist.id }, 4))?.data
    }) as UseQueryResult<GetUserVideosReturnType>

    const { register, handleSubmit, formState: { errors } } = useForm<PlaylistInput>({
        defaultValues: { name: playlist.name }, resolver: yupResolver(playlistAddSchema)
    })

    const handleSubmitMutation = useMutation(async (formData: PlaylistInput) => {
        const status = await updatePlaylist(playlist.id, formData)
        setIsEditable(false);
        setToasterMessage(status.message)
        queryClient.invalidateQueries({ queryKey: ["play-lists"] });
    })

    const deletePlaylistMutation = useMutation(async (playlistId: string) => {
        const status = await deletePlaylist(playlist.id)
        setToasterMessage(status.message)
        queryClient.invalidateQueries({ queryKey: ["play-lists"] });
    })

    const [isEditable, setIsEditable] = React.useState(false);

    return playlistVideos.data && (
        <Card ref={ref} className={cn("w-full flex flex-col gap-2 overflow-hidden p-3", className)} {...props}>
            <Link href={`/videos?playlist_id=${playlist.id}`} prefetch={true}>
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
                                src={playlistVideos.data[0]?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                                alt={playlistVideos.data[0]?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                                placeholder="blur"
                                blurDataURL={playlistVideos.data[0]?.thumbnails?.standard?.url ?? "https://github.com/shadcn.png"}
                                height={100}
                                width={500}
                                className="rounded object-cover"
                            />
                        ))
                    }

                    {!playlistVideos.data.length && (
                        Array(4).fill(null).map((e, index) => (
                            <Image
                                key={index}
                                src={"https://github.com/shadcn.png"}
                                alt={"https://github.com/shadcn.png"}
                                placeholder="blur"
                                blurDataURL={"https://github.com/shadcn.png"}
                                height={100}
                                width={200}
                                className="rounded object-cover" />
                        ))
                    )}

                </CardContent>
            </Link>

            <CardFooter className="flex-col items-start py-0 px-0">
                {isEditable ?
                    <form onSubmit={handleSubmit((data) => handleSubmitMutation.mutate(data))} className="flex items-center gap-2 w-full">
                        <div className="flex flex-col space-y-1.5 flex-1 ">
                            <Input id="playlist-name " placeholder="Enter the playlist name" {...register("name")} />
                        </div>

                        <SubmitButton isLoading={handleSubmitMutation.isLoading} >
                            <IoCheckmarkDoneOutline size={20} />
                        </SubmitButton>

                        <Button onClick={() => setIsEditable(false)} className="text-muted-foreground" variant="outline">
                            <IoMdClose size={20} />
                        </Button>
                    </form>
                    :
                    <div className="flex items-center justify-between w-full">
                        <div className="p-2">
                            <p className=" font-semibold uppercase text-muted-foreground">{playlist.name}</p>
                        </div>

                        <div className="flex gap-2">
                            <Button onClick={() => setIsEditable(true)}>
                                <FaRegEdit size={20} />
                            </Button>

                            <SubmitButton isLoading={deletePlaylistMutation.isLoading}
                                onClick={() => deletePlaylistMutation.mutate(playlist.id)}
                                className="border border-red-400 text-red-400 hover:bg-red-400 hover:text-white" variant="outline">
                                <MdDelete size={20} />
                            </SubmitButton>
                        </div>
                    </div>
                }
            </CardFooter>
        </Card>

    )
})

PlaylistCard.displayName = "PlaylistCard"

export default PlaylistCard



