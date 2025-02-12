import CredentialsProvider from "next-auth/providers/credentials";

import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions, } from "next-auth";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { getUserByEmail } from "@/services/user_service.DB";
import { sendEmailVerificationMail } from "@/server_actions/mail_action";

import { DrizzleAdapter } from "@auth/drizzle-adapter"

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any,
    

    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                if (!credentials?.email) throw new Error("Email is required");
                const user: any = await getUserByEmail(credentials.email, true);
                if (!user) throw new Error("No User Found with this email")
                const checkPassword = await compare(credentials.password, user.password);
                if (!checkPassword) throw new Error("Username or Password doesn't match")
                return user;
            }
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),

        EmailProvider({
            async sendVerificationRequest({ identifier, url }) {
                if (!identifier) new Error("Email ID is required")
                await sendEmailVerificationMail(identifier, url);
            }
        }),
    ],

    session: {
        strategy: "jwt",
    },

    callbacks: {
        async jwt({ token }) {
            if (!token?.email) return token;
            const auth: any = await getUserByEmail(token.email)
            if (!auth) return token;
            token = auth;
            return token;
        },

        async session({ session, }) {
            if (!session?.user?.email) return session;
            const auth = await getUserByEmail(session.user.email)
            session.user = auth as any
            return session
        },
    },

    pages: {
        signIn: '/login',
        error: '/api/auth/error',
    }
};


