"use client"

import Main from "@/components/ui/Main"
import VideoAdd from "./video-add"
import VideoContainer from "@/app/(protected_pages)/videos/video-container"

const Page = () => {
    return (
        <Main className="flex-1">
            <div className="fixed bottom-5 right-7 md:right-12 z-50">
                <VideoAdd />
            </div>

            <div className="h-[85vh] md:h-[89vh] overflow-y-scroll custom-scrollbar md:pr-5">
                <VideoContainer />
            </div>
        </Main>
    )
}

export default Page