"use server"

import * as React from "react"

import Card from "../card";
import Section from '@/components/ui/section'
import { getUserByEmail } from "@/services/user_service.DB";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: Promise<{ email: string }> }) => {
    const { email: emailParam } = await params;
    if (!emailParam) return redirect("/404");
    const email = decodeURIComponent(emailParam);
    if (!await getUserByEmail(email)) return redirect("/404");
    return (
        <Section className="h-screen items-center justify-center">
            <Card email={email} />
        </Section>)
}

export default Page
