"use client"

import { AspectRatio } from "@radix-ui/react-aspect-ratio"
import { DownloadInput } from "@/type"
import Error from "@/components/ui/error"
import { Input } from "@/components/ui/input"
import React from "react"
import SubmitButton from "@/components/ui/submit_button"
import { cn } from "@/lib/utils"
import { downloadInputSchema } from "@/yup/shema"
import { extractYouTubeVideoId } from "@/server_actions/video_action"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useToastError from "@/components/hooks/use-toast-message"
import { yupResolver } from "@hookform/resolvers/yup"

interface SearchInputProps extends
    React.HTMLAttributes<HTMLDivElement> {
    url: string | undefined,
    setUrl: React.Dispatch<React.SetStateAction<string>>
    isLoading: boolean,
}

const SearchInput = React.forwardRef<HTMLDivElement, SearchInputProps>(
    ({ url, setUrl, isLoading, className, children, ...props }, ref) => {
        const [setToasterMessage] = useToastError();

        const [youtubeVideoId, setYoutubeVideoId] = React.useState<string>();

        const { register, handleSubmit, formState: { errors } } = useForm<DownloadInput>({
            defaultValues: { url: url },
            resolver: yupResolver(downloadInputSchema)
        })

        const handleSubmitMutation = useMutation(async (formData: DownloadInput) => {
            const videoId = await extractYouTubeVideoId(formData.url)
            if (!videoId.length) return { error: "Url Must be a Youtube Url" }
            setUrl(formData.url);
            setYoutubeVideoId(videoId)
        })

        React.useEffect(() => {
            const fetchData = async () => {
                if (!url) return;
                const videoId = await extractYouTubeVideoId(url);
                setYoutubeVideoId(videoId);
            };

            fetchData();
        }, [url]);

        React.useEffect(() => {
            if (!handleSubmitMutation.data) return;
            if (handleSubmitMutation.data?.error) {
                return setToasterMessage({ error: handleSubmitMutation.data.error });
            }
        }, [handleSubmitMutation.data])

        return (
            <div ref={ref} className={cn(" md:px-96", className)}{...props}>
                {url && youtubeVideoId && (
                    <AspectRatio ratio={16 / 9} className=" mb-5">
                        <iframe
                            src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0`}
                            title="YouTube video" allowFullScreen
                            className="w-full h-full rounded-md"></iframe>
                    </AspectRatio>
                )}

                <form onSubmit={handleSubmit((data) => handleSubmitMutation.mutate(data))}>
                    <div className="grid gap-4 items-center ">
                        <div className="flex flex-col space-y-1.5">
                            <Input className="" id="email" placeholder="Enter Youtube Video Url" {...register("url")} />
                            <Error message={errors.url?.message} />
                        </div>
                        <div className="flex justify-center">
                            <SubmitButton isLoading={isLoading} className=" w-60">Submit</SubmitButton>
                        </div>
                    </div>
                </form>
            </div>
        )
    })

SearchInput.displayName = "SearchInput"

export default SearchInput