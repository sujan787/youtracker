import Section from "@/components/ui/section";
import SideNavigationBar from "@/app/(protected_pages)/side-navigation-bar";
import UpperNavigationBar from "@/app/(protected_pages)/upper-navigation-bar";

// Protected pages depend on the session and URL search params, so they are
// always rendered dynamically rather than statically prerendered.
export const dynamic = "force-dynamic";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UpperNavigationBar />

            <Section className="flex-row">
                <SideNavigationBar />
                <div className="flex-1 min-w-0">
                    {children}
                </div>
            </Section>
        </>
    )
}
