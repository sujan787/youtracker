import { Button, ButtonProps, buttonVariants } from './button'

import { CSSProperties } from 'react'
import ClipLoader from "react-spinners/ClipLoader";
import React from 'react';
import { cn } from '@/lib/utils';

interface SubmitButtonProps extends ButtonProps {
    isLoading: boolean,
}

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
    position: "absolute",
};

const SubmitButton = React.forwardRef<HTMLButtonElement, SubmitButtonProps>(
    ({ isLoading, className, ...props }, ref
    ) => {
        const variant = isLoading ? "secondary" : "default";

        return (<Button variant={variant} type="submit" className={cn(className)} ref={ref} {...props}>
            {isLoading ? <ClipLoader
                color={"black"}
                loading={isLoading}
                cssOverride={override}
                size={20}
                aria-label="Loading Spinner"
                data-testid="loader"
            /> : props.children}
        </Button>)
    })

SubmitButton.displayName = "SubmitButton"

export default SubmitButton
