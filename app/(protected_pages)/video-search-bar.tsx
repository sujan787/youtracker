"use client"

import { Form, FormField } from "../../components/ui/form"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "../../components/ui/select"
import { UseQueryResult, useMutation, useQuery } from "@tanstack/react-query"

import { BsBookmarkStar } from "react-icons/bs";
import { BsBookmarkStarFill } from "react-icons/bs";
import { BsSearch } from "react-icons/bs"
import { Button } from "@/components/ui/button";
import { Input } from "../../components/ui/input"
import React from "react"
import SubmitButton from "../../components/ui/submit_button"
import { VideoSearchInput } from "@/type"
import { cn } from "@/lib/utils"
import { getAllPlaylists } from "@/server_actions/playlist_action"
import { getUserPlayListsReturnType } from "@/services/playlist_service.DB"
import { redirect } from 'next/navigation'
import { useForm } from "react-hook-form"
import { useGlobalState } from "../../components/hooks/use-global-state"
import useLocalStorage from "@/components/hooks/use-local-storage";
import { useSearchParams } from 'next/navigation'

const VideoSearchBar = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, title, children, ...props }, ref) => {

    const searchParams = useSearchParams()

    const playlists = useQuery({
        queryKey: ["play-lists"], queryFn: async () => (await getAllPlaylists())?.data
    }) as UseQueryResult<getUserPlayListsReturnType>

    const form = useForm<VideoSearchInput>({
        defaultValues: {
            keyword: searchParams.get('keyword') ?? "",
            playlist_id: searchParams.get('playlist_id') ?? ""
        },
    })

    const [data, setData] = useGlobalState<VideoSearchInput>("search_items", form.getValues())

    const { storedValue, setValue } = useLocalStorage('searchParams', form.getValues());

    form.watch((data, { name, type }) => setData(data))

    const handleSubmitMutation = useMutation(async (data: VideoSearchInput) => {
        return { redirect_url: `/videos?keyword=${data.keyword}&playlist_id=${data.playlist_id}` }
    })

    const setAsDefaultSearchParams = () => setValue(data)

    const deleteDefaultSearchParams = () => setValue({ "keyword": "", "playlist_id": "" });

    React.useEffect(() => {
        if (handleSubmitMutation.data?.redirect_url)
            redirect(handleSubmitMutation.data?.redirect_url)
    }, [handleSubmitMutation.data])

    React.useEffect(() => {
        if (!storedValue) return;
        form.setValue("keyword", storedValue.keyword);
        form.setValue("playlist_id", storedValue.playlist_id);
    }, [storedValue]);

    return (
        <div className={cn("", className)} {...props}>
            <form onSubmit={form.handleSubmit((data) => handleSubmitMutation.mutate(data))}>
                <Form {...form}>
                    <div className="w-full flex flex-col md:flex-row justify-center gap-2 ">
                        <Input {...form.register("keyword")} type="text" className="w-full md:w-[40%] " placeholder="search..." />

                        <Select onValueChange={(value) => form.setValue("playlist_id", value)} value={data.playlist_id}>
                            <SelectTrigger className=" w-full md:w-[180px] overflow-hidden">
                                <SelectValue placeholder="Select Playlists" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Playlists</SelectLabel>
                                    <SelectItem value="">All</SelectItem>
                                    {playlists.data && playlists.data.map((list) => (
                                        <SelectItem value={list.id} key={list.id}>{list.name}</SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <div className="flex items-center gap-2">
                            <SubmitButton isLoading={false} className="w-full">
                                <BsSearch className="mr-2" /> Search
                            </SubmitButton>

                            {!!(form.getValues("keyword") || form.getValues("playlist_id")) &&
                                (<div className=" transition duration-500 ease-in-out">
                                    {!!(storedValue?.keyword || storedValue?.playlist_id) ?
                                        <Button className="px-1" type="button" variant="ghost" onClick={() => deleteDefaultSearchParams()}>
                                            <BsBookmarkStarFill size={20} className="text-primary" />
                                        </Button>
                                        :
                                        <Button className="px-1" type="button" variant="ghost" onClick={() => setAsDefaultSearchParams()}>
                                            <BsBookmarkStar size={20} />
                                        </Button>
                                    }
                                </div>)
                            }
                        </div>
                    </div>
                </Form>
            </form>
        </div>
    )
})

VideoSearchBar.displayName = "VideoSearchBar"

export default VideoSearchBar