import { Card } from "@/components/ui/card";
import Section from "@/components/ui/section";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {

    return (
        <Section className="h-screen items-center justify-center">
            <Card className="w-[350px] p-5 flex flex-col gap-3">
                <Skeleton className=" w-full h-7" />
                <Skeleton className=" w-full h-7" />
                <Skeleton className=" w-full h-7" />
                <Skeleton className=" w-full h-7" />
                <Skeleton className=" w-full h-7" />
                <Skeleton className=" w-full h-7" />
            </Card>
        </Section>
    )
}