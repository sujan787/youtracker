import * as React from "react"

import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const errorVariants = cva(
    "text-xs text-primary absolute whitespace-nowrap z-10 text-right top-[-2px] w-full",
    {
        variants: {
            position: {
                left: "text-left",
                right: "text-right",
                center: "text-center"
            },
        },
        defaultVariants: {
            position: "left",
        },
    }
)

interface ErrorProps extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof errorVariants> {
    message: string | undefined,
}

const Error = React.forwardRef<HTMLDivElement, ErrorProps>(
    ({ message, position, className, children, ...props }, ref) => (
        <div ref={ref} className={cn("relative h-full", className)}{...props}>
            <p className={cn(errorVariants({ position }))}>{message}</p>
        </div>
    ))

Error.displayName = "Error"

export default Error