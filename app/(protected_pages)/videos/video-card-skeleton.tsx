import React from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const VideoCardSkeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => (

        <div ref={ref} className={cn("flex flex-col gap-2", className)} {...props}>
            <Skeleton className="w-full h-[15rem]" />
            <Skeleton className="h-5 w-[70%] " />
            <Skeleton className="h-5 w-20 " />
        </div>
    ))

VideoCardSkeleton.displayName = "VideoCardSkeleton"

export default VideoCardSkeleton