"use server"

import ThemeToggler from "@/components/ui/theme-toggler"
import { UserType } from "@/type";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from 'next/navigation'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions) as { user: UserType };
    if (session?.user && session?.user?.emailVerified) return redirect("/videos");
    return (
        <>
            <div className=" absolute right-1 top-1">
                <ThemeToggler />
            </div>
            {children}
        </>
    )
}