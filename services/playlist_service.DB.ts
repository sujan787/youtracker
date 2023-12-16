import { desc, eq, placeholder } from "drizzle-orm"

import { UserType } from "@/type"
import { authOptions } from "@/lib/auth"
import { db } from "@/db"
import { getServerSession } from "next-auth"
import { playlists } from "@/db/schema/playlists"

export type PlayListType = {
    id?: number
    name: string
}

export type AddPlaylistParamType = {
    name: string
}

export const addPlaylist = async (data: AddPlaylistParamType) => {
    const playlistId = crypto.randomUUID();
    const session = await getServerSession(authOptions) as { user: UserType };
    try {
        await db.insert(playlists).values({ id: playlistId, user_id: session.user.id, ...data })
    } catch (error) {
        throw new Error("play list can not be created")
    }

    return { id: playlistId }
}

export const getUserPlayLists = async () => {
    const session = await getServerSession(authOptions) as { user: UserType };

    return (await db.query.playlists.findMany({
        where: eq(playlists.user_id, session.user.id),
        orderBy: desc(playlists.created_at)
    }))
}

export type getUserPlayListsReturnType = Awaited<ReturnType<typeof getUserPlayLists>>

export const updatePlaylist = async (playlistId: string, data: AddPlaylistParamType) => {
    await db.update(playlists).set(data).where(eq(playlists.id, playlistId))
}

export const deletePlaylist = async (playlistId: string) => {
    await db.delete(playlists).where(eq(playlists.id, playlistId));
}



