import * as React from "react"

import { AddVideoFormInput, VideoSearchInput } from "@/type";
import { AiOutlinePlus, AiOutlineVideoCameraAdd } from "react-icons/ai";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Form, FormField } from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {
    UseQueryResult,
    useMutation,
    useQuery,
    useQueryClient
} from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { DialogClose } from "@radix-ui/react-dialog";
import Error from "@/components/ui/error";
import { GetUserVideosReturnType } from "@/services/video_service.DB";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import SubmitButton from "@/components/ui/submit_button";
import { cn } from "@/lib/utils"
import { getAllPlaylists } from "@/server_actions/playlist_action";
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB";
import { saveVideo } from "@/server_actions/video_action";
import { useForm } from "react-hook-form";
import { useGlobalState } from "@/components/hooks/use-global-state";
import useToastMessage from "@/components/hooks/use-toast-message";
import { videoAddSchema } from "@/yup/shema";
import { yupResolver } from "@hookform/resolvers/yup";

const VideoAdd = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
        const queryClient = useQueryClient();
        const [setToasterMessage] = useToastMessage();
        const [data] = useGlobalState<VideoSearchInput>("search_items")

        const playlists = useQuery({
            queryKey: ["play-lists"], queryFn: async () => (await getAllPlaylists())?.data
        }) as UseQueryResult<getUserPlayListsReturnType>

        const form = useForm<AddVideoFormInput>({
            defaultValues: { url: "", playlist_id: "", playlist_name: "" },
            resolver: yupResolver(videoAddSchema)
        })

        const handleSubmitMutation = useMutation(async (formData: AddVideoFormInput) => {
            const status = await saveVideo(formData)

            const videoQuery = queryClient.getQueryData(
                ["videos", `${data.keyword}-${data.playlist_id}`]
            ) as { pages: GetUserVideosReturnType };

            const videos = videoQuery?.pages ?? []

            queryClient.setQueryData(
                ["videos", `${data.keyword}-${data.playlist_id}`],
                { pages: [status.data, ...videos] }
            )

            form.reset()

            return status;
        })

        React.useEffect(() => {
            if (!handleSubmitMutation.data) return;
            setToasterMessage(handleSubmitMutation.data?.message);
        }, [handleSubmitMutation.data])

        return (
            <div ref={ref} className={cn("", className)} {...props}>
                <Dialog>
                    <DialogTrigger className="hover:bg-accent">
                        <AiOutlineVideoCameraAdd size={60} className="border p-3 text-muted-foreground rounded shadow" />
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Video</DialogTitle>
                            <DialogDescription>
                                Organize Important Youtube videos
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={form.handleSubmit((data) => handleSubmitMutation.mutate(data))}>
                            <Form {...form}>
                                <div className="grid gap-4 py-4">
                                    <div className="flex items-center gap-4">
                                        <Label htmlFor="" className="text-right"> URL </Label>
                                        <div className="flex flex-col w-full">
                                            <Error message={form?.formState?.errors.url?.message} position="right" className="top-[-1.3rem]" />
                                            <FormField
                                                control={form.control}
                                                name="url"
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="enter the url" />
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <Collapsible className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <Label htmlFor="" className="text-right">
                                                Play List
                                            </Label>
                                            <FormField
                                                control={form.control}
                                                name="playlist_id"
                                                render={({ field }) => (
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <SelectTrigger className="flex-1">
                                                            <SelectValue placeholder="Select Playlists" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectGroup>
                                                                <SelectLabel>Playlists</SelectLabel>
                                                                <SelectItem value="">All</SelectItem>
                                                                {playlists.data && playlists.data.map((list: getUserPlayListsReturnType[0]) => (
                                                                    <SelectItem value={list.id} key={list.id}>{list.name}</SelectItem>
                                                                ))}
                                                            </SelectGroup>
                                                        </SelectContent>
                                                    </Select>
                                                )}
                                            />

                                            <CollapsibleTrigger>
                                                <Button variant="outline" type="button">
                                                    <AiOutlinePlus className="text-muted-foreground" />
                                                </Button>
                                            </CollapsibleTrigger>
                                        </div>

                                        <CollapsibleContent>
                                            <FormField
                                                control={form.control}
                                                name="playlist_name"
                                                render={({ field }) => (
                                                    <Input id="name" className="col-span-3" {...field} />
                                                )}
                                            />
                                        </CollapsibleContent>
                                        <Error message={form.formState?.errors?.playlist_name?.message} />
                                    </Collapsible>
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <SubmitButton type="submit" isLoading={handleSubmitMutation.isLoading}>Save</SubmitButton>
                                    </DialogClose>
                                </DialogFooter>
                            </Form>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        )
    })

VideoAdd.displayName = "VideoAdd"

export default VideoAdd