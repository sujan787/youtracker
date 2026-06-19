import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";
import { compare } from "bcryptjs";
import { db } from "@/db";
import { getUserByEmail } from "@/services/user_service.DB";
import { sendEmailVerificationMail } from "@/server_actions/mail_action";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

export const authOptions: NextAuthOptions = {
    adapter: DrizzleAdapter(db) as any,

    // Required by next-auth for signing the JWT session cookie.
    secret: process.env.NEXTAUTH_SECRET,

    session: {
        strategy: "jwt",
    },

    providers: [
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }
                const user: any = await getUserByEmail(credentials.email, true);
                if (!user || !user.password) {
                    throw new Error("No user found with this email");
                }
                const isValid = await compare(credentials.password, user.password);
                if (!isValid) {
                    throw new Error("Email or password doesn't match");
                }
                return user;
            },
        }),

        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
            // Let users who first registered with email also sign in with the
            // same Google email instead of hitting OAuthAccountNotLinked.
            allowDangerousEmailAccountLinking: true,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
            // Google has already verified the address, so mark it verified at
            // creation time. This stops Google users from being bounced into
            // the email-verification flow by the auth middleware.
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                    emailVerified: profile.email_verified ? new Date() : null,
                } as any;
            },
        }),

        EmailProvider({
            async sendVerificationRequest({ identifier, url }) {
                if (!identifier) throw new Error("Email ID is required");
                await sendEmailVerificationMail(identifier, url);
            },
        }),
    ],

    callbacks: {
        // Runs on every request, but we only touch the database on sign-in
        // (when `user` is present) or an explicit session update. The relevant
        // fields are then cached on the token, avoiding a DB round-trip per
        // request.
        async jwt({ token, user, trigger }) {
            const email = user?.email ?? token.email;
            if ((user || trigger === "update") && email) {
                const dbUser: any = await getUserByEmail(email);
                if (dbUser) {
                    token.id = dbUser.id;
                    token.name = dbUser.name;
                    token.email = dbUser.email;
                    (token as any).emailVerified = dbUser.emailVerified ?? null;
                }
            }
            return token;
        },

        // Hydrate the session straight from the token — no extra DB query.
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).id = token.id ?? token.sub;
                session.user.name = (token.name as string) ?? null;
                session.user.email = (token.email as string) ?? null;
                (session.user as any).emailVerified = (token as any).emailVerified ?? null;
            }
            return session;
        },
    },

    pages: {
        signIn: "/login",
    },
};
