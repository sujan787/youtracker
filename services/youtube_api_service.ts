import axios from "axios";
import ytdl from 'ytdl-core';

type YoutubeVideoInfoApiParamsType = {
    method: "GET" | "POST",
    url: string,
    params: {
        part: "snippet",
        id: string,
        key: string
    }
}

export type YoutubeVideoInfoApiResponseType = {
    "kind": string,
    "etag": string,
    "items": [
        {
            "kind": string,
            "etag": string,
            "id": string,
            "snippet": {
                "publishedAt": Date,
                "channelId": string,
                "title": string,
                "description": string,
                "thumbnails": {
                    "default": {
                        "url": string,
                        "width": number,
                        "height": number
                    },
                    "medium": {
                        "url": string,
                        "width": number,
                        "height": number
                    },
                    "high": {
                        "url": string,
                        "width": number,
                        "height": number
                    },
                    "standard": {
                        "url": string,
                        "width": number,
                        "height": number
                    },
                    "maxres": {
                        "url": string,
                        "width": number,
                        "height": number
                    }
                },
                "channelTitle": string,
                "tags": Array<string>,
                "categoryId": string,
                "liveBroadcastContent": string,
                "localized": {
                    "title": string,
                    "description": string
                },
                "defaultAudioLanguage": string
            }
        }
    ],
    "pageInfo": {
        "totalResults": number,
        "resultsPerPage": number
    }
}

export type DownloadSourceType = {
    video_sources: Array<{
        type: string
        url: string
        has_audio: boolean
    }>,
    audio_sources: Array<{
        type: string
        url: string
    }>
}

export const fetchYoutubeVideoInfo = async (videoId: string)
    : Promise<YoutubeVideoInfoApiResponseType> => {
    console.log("fetchYoutubeVideoInfo")
    const options: YoutubeVideoInfoApiParamsType = {
        method: "GET",
        url: `${process.env.YOUTUBE_API_URL}/videos`,
        params: { part: "snippet", id: videoId, key: `${process.env.YOUTUBE_API_KEY}` }
    }

    return (await axios.request(options)).data;
}

export const getYoutubeDownloadSources = async (youtubeUrl: string)
    : Promise<DownloadSourceType | undefined> => {
    let sources;
    console.log("getYoutubeDownloadSources")
    try {
        const metaInfo = await ytdl.getInfo(youtubeUrl)
        const formats = metaInfo.formats

        sources = formats.reduce((acu, cur) => {
            if (!cur.url || !cur.mimeType) return acu;

            const type = `${cur.mimeType.split(";")[0]} ${cur.qualityLabel ?? ''}`

            if (cur.hasAudio && !cur.hasVideo) {
                acu["audio_sources"] = [...acu.audio_sources, {
                    url: cur.url,
                    type: type,
                }]
            }

            if (cur.hasVideo) {
                acu["video_sources"] = [...acu.video_sources, {
                    url: cur.url,
                    type: type,
                    has_audio: !!cur.hasAudio
                }]
            }

            return acu;

        }, { audio_sources: [], video_sources: [] } as DownloadSourceType)

    } catch (error: any) {
        console.log(error.message)
    }

    return sources;
}
