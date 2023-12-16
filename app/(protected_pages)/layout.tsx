"use client"

import Section from "@/components/ui/section";
import SideNavigationBar from "@/app/(protected_pages)/side-navigation-bar";
import UpperNavigationBar from "@/app/(protected_pages)/upper-navigation-bar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UpperNavigationBar />

            <Section className="flex-row ">
                <SideNavigationBar />
                {children}
            </Section>
        </>
    )
}
