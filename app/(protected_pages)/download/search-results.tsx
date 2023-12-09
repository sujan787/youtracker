import { Button } from "@/components/ui/button"
import { DownloadSourceType } from "@/services/youtube_api_service"
import React from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import ytdl from "ytdl-core"

interface SearchResultsProps extends
    React.HTMLAttributes<HTMLDivElement> {
    downloadSource: DownloadSourceType | undefined
}

const SearchResults = React.forwardRef<HTMLDivElement, SearchResultsProps>(
    ({ downloadSource, className, children, ...props }, ref) => {

        const downloadFromSource = async (url: string) => {
            try {
                
            } catch (error) {
                console.error('Error downloading video:', error);
            }
        }

        return (
            <div ref={ref} className={cn("", className)}{...props}>

                {(!!downloadSource?.video_sources?.length || !!downloadSource?.audio_sources?.length) && (
                    <div className="flex flex-col justify-between gap-8 md:gap-14">
                        <div className="flex flex-col w-full gap-5 md:gap-7">
                            <p className="font-semibold text-lg text-muted-foreground text-center">Video Download Sources</p>

                            <div className="grid md:grid-cols-7 gap-3 md:gap-5">
                                {!!downloadSource.video_sources?.length &&
                                    downloadSource.video_sources.map((source, index) => (
                                        <Button variant="outline" key={index}  className=" text-muted-foreground text-sm">
                                            <a href={source.url} target="_blank" download="file">{source.type}</a>
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>

                        <div className="flex flex-col w-full gap-5 md:gap-7">
                            <p className="font-semibold text-lg text-muted-foreground text-center">Audio Download Sources</p>

                            <div className="grid md:grid-cols-7 gap-3 md:gap-5">
                                {!!downloadSource.audio_sources?.length &&
                                    downloadSource.audio_sources.map((source, index) => (
                                        <Button variant="outline" key={index}>
                                            <a href={source.url} target="_blank" download="file" className=" text-muted-foreground text-sm">{source.type}</a>
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )}
            </div>
        )
    })

SearchResults.displayName = "SearchResults"

export default SearchResults