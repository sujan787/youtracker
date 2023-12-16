"use client"

import React, { useState } from "react";
import { UseQueryResult, useQuery } from "@tanstack/react-query";

import { DownloadSourceType } from "@/services/youtube_api_service";
import Main from "@/components/ui/Main"
import SearchInput from "./search-input";
import SearchResults from "./search-results";
import { getDownloadSources } from "@/server_actions/download_action";

interface PageProps {
    params: { slug: string },
    searchParams: { url: string }
}


const Page = ({ params, searchParams }: PageProps) => {
    const [url, setUrl] = useState<string>(searchParams?.url);

    const downloadSource = useQuery({
        queryKey: [`download_source_${url}`],
        queryFn: async () => {
            if (!url) return { video_sources: [], audio_sources: [] };
            return (await getDownloadSources(url))?.data
        }
    }) as UseQueryResult<DownloadSourceType>

    return (
        <Main className="flex-1 flex flex-col gap-10">
            <div>
                <p className="font-semibold text-xl md:text-3xl text-muted-foreground text-center mb-2 mt-2">
                    Download Your Youtube video
                </p>

                <p className="text-muted-foreground text-center mb-4">Download your favorite YT Videos as MP3, MP4, WEBM and more!</p>
                <SearchInput url={url} setUrl={setUrl} isLoading={downloadSource.isLoading} />
            </div>
            <div>
                <SearchResults downloadSource={downloadSource.data} />
            </div>
        </Main>
    )
}

export default Page