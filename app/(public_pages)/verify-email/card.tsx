"use client"

import * as React from "react"

import {
    Card as BoxCard,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

import Error from "@/components/ui/error"
import { FC } from "react";
import Link from "next/link";
import SubmitButton from "@/components/ui/submit_button"
import { emailVerificationSchema } from "@/yup/shema"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useToastMessage from "@/components/hooks/use-toast-message"
import { yupResolver } from "@hookform/resolvers/yup"

interface CardProps {
    email: string | undefined
}

const Card: FC<CardProps> = ({ email }) => {

    const [setToasterMessage] = useToastMessage();

    const { handleSubmit, formState: { errors } } = useForm<{ email: string }>({
        defaultValues: { email: email ?? "" },
        resolver: yupResolver(emailVerificationSchema)
    })

    const handleSubmitMutation = useMutation(async (formData: { email: string }) => {
        const status = await signIn("email", { email: formData.email, redirect: false });
        return status;
    })

    React.useEffect(() => {
        if (!handleSubmitMutation.data) return;
        if (handleSubmitMutation.data.error) return setToasterMessage({ error: handleSubmitMutation.data.error });
        if (handleSubmitMutation.data.ok) return setToasterMessage({ success: `Email Verification mail has been sent to ${email}` })
    }, [handleSubmitMutation.data])

    return (<>
        <BoxCard className="w-[350px] md:w-[450px] lg:w-[450px]">
            <CardHeader>
                <CardTitle className="text-center">
                    Verify Your Email
                </CardTitle>
                <CardDescription className="text-center">Thank You for signing up! Before getting started, Could you verify your email address by clicking on the link we just emailed  to you? If you didn't receive the email, we will gladly send you another</CardDescription>
            </CardHeader>

            <CardContent className="flex flex-col">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <SubmitButton className="w-full relative"
                            onClick={handleSubmit((data) => handleSubmitMutation.mutate(data))}
                            isLoading={handleSubmitMutation.isLoading}>Resend Verification Mail
                        </SubmitButton>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{email}</p>
                    </TooltipContent>
                </Tooltip>
                <Error position="right" message={errors.email?.message} />
            </CardContent>

            <CardFooter className="flex flex-col justify-between ">
                <small className="flex items-center">want to go back to the login page?
                    <span><Link href={`/login`} className="p-0 h-0 ml-1 underline" >Click Here</Link></span>
                </small>
            </CardFooter>
        </BoxCard>
    </>);
}

export default Card;