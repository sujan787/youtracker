import HashLoader from "react-spinners/HashLoader"
import React from "react"
import { cn } from "@/lib/utils"

interface VideoLoaderProps extends
    React.HTMLAttributes<HTMLDivElement> {
    isLoading: boolean,
}

const VideoLoader = React.forwardRef<HTMLDivElement, VideoLoaderProps>(({ isLoading, className, ...props }, ref) => {
    return (
        <div ref={ref} className={cn("relative", className)}{...props}>
            <div className="absolute  bottom-[20%] z-10 flex items-center gap-3">
                <HashLoader
                    color={"#6b7280"}
                    loading={isLoading}
                    size={20}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                    className="text-primary"
                />
                
                {isLoading &&
                    <p className=" text-muted-foreground">Loading More Videos...</p>}
            </div>
        </div>
    )
})

VideoLoader.displayName = "VideoLoader"

export default VideoLoader



