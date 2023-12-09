import * as React from "react"

import { cn } from "@/lib/utils"

const Section = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "w-full flex flex-row",
            className
        )}
        {...props}
    />
))

Section.displayName = "Section"

export default Section