import { Providers } from '@/components/context/providers.client';
import { accounts } from './db/schema/accounts';
import { playLists } from './db/schema/playlists';
import { error } from 'console';
import { routes } from './routes';
export type SignUpFormInput = {
    name: string,
    email: string,
    password: string,
    confirm_password: string,
}

export type CreateUserType = {
    name: string,
    email: string,
    password?: string,
}

export type LogInFormInput = {
    email: string,
    password: string,
}

export type VideoSearchInput = {
    keyword?: string,
    playlist_id?: string
}

export type AddVideoFormInput = {
    url: string,
    playlist_id?: string,
    playlist_name?: string,
}

export type DownloadInput = {
    url: string
}

export type AddPlayListInput = {
    name: string
}

export type ServerActionReturnType = Promise<{
    message?: { error?: string, success?: string },
    is_ok: boolean,
    data?: any
}>

export type AuthUserSessionType = {
    user: UserType
}

export type UserType = {
    id: string,
    email: string,
    name: string,
    password?: string,
    emailVerified: Date | null;
    created_at?: Date;
    update_at?: Date;
    account?: {
        provider: "google"
    }
}


export type protectedRoutes = Exclude<typeof routes[number], '/login' | '/register'>;

export type MiddlewareConfigType = {
    matcher: [...protectedRoutes[]]
}

export type VerifyAuthTokenActionTypes = "EMAIL_VERIFY" | "RESET_PASSWORD"

export type GenerateAuthTokenTypes = {
    user: UserType,
    redirect_route: typeof routes[number],
    action: VerifyAuthTokenActionTypes
}

export type AccountType = {
    userId: string,
    type: "oauth",
    provider: "google" | "email",
    providerAccountId: string,
    refreshToken?: string | null,
    access_token: string,
    expires_at: number,
    token_type: "Bearer",
    scope: string,
    id_token: string,
    session_state?: string | null
}

export type TokenSetParameters = {
    access_token: string,
    expires_at: number,
    scope: string,
    id_token: string,
}

export type NavMenusTypes = Array<{
    title: string,
    route: typeof routes[number],
    icon: React.ReactNode,
    subMenus?: Array<{
        title: string,
        route: typeof routes[number],
    }>
}>
