
"use server"

import { ServerActionReturnType, SignUpFormInput, TokenSetParameters, UserType } from "@/type"

import { GoogleProfile } from "next-auth/providers/google";
import { User } from "next-auth";
import { createUser as addUser } from "@/services/user_service.DB";
import { getUserByEmail } from "@/services/user_service.DB";

export const createUser = async (data: SignUpFormInput): ServerActionReturnType => {
    const isDuplicate = await getUserByEmail(data.email);
    if (isDuplicate) return { message: { error: "Email Already Exists" }, is_ok: false }

    try {
        await addUser(data);
        return { message: { success: "Account Create Success Fully" }, is_ok: true }
    } catch (error) {
        return { message: { error: "Internal Server Error" }, is_ok: false }
    }
}

// export const saveGoogleLoginUser =
//     async (profile: GoogleProfile, token: TokenSetParameters)
//         : Promise<UserType | undefined> => {
//         const user = await addUser({ name: profile.name, email: profile.email });
//         if (!user) return;
//         await createAccount(
//             {
//                 userId: user.id,
//                 access_token: token.access_token,
//                 expires_at: token.expires_at,
//                 id_token: token.id_token,
//                 provider: "google",
//                 scope: token.scope,
//                 providerAccountId: token.id_token,
//                 session_state: null,
//                 token_type: "Bearer",
//                 type: "oauth",
//                 refreshToken: null
//             });
//         return user;
//     }