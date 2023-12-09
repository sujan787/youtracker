
"use client"

import * as React from "react"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import Error from "@/components/ui/error"
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { LogInFormInput } from "@/type"
import Section from '@/components/ui/section'
import SubmitButton from "@/components/ui/submit_button"
import { loginSchema } from "@/yup/shema"
import { redirect } from 'next/navigation'
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useToastError from "@/components/hooks/use-toast-message"
import { yupResolver } from "@hookform/resolvers/yup"

const Page = () => {
    const [setToasterMessage] = useToastError();
    const { register, handleSubmit, formState: { errors } } = useForm<LogInFormInput>({
        defaultValues: { email: "", password: "" }, resolver: yupResolver(loginSchema)
    })

    const handleSubmitMutation = useMutation(async (formData: LogInFormInput) => {
        const status = await signIn("credentials",
            { ...formData, redirect: false, callbackUrl: "/videos" });
        return status;
    })

    React.useEffect(() => {
        if (!handleSubmitMutation.data) return;
        if (handleSubmitMutation.data.error) return setToasterMessage({ error: handleSubmitMutation.data.error });
        if (handleSubmitMutation.data.ok) return redirect("/videos")
    }, [handleSubmitMutation.data])

    return <Section className="h-screen items-center justify-center">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-center">Login Your Account</CardTitle>
                <CardDescription className="text-center">Use all Seo Tools from one place</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => signIn("google")} variant="outline" className="font-semibold flex gap-3 w-full">
                    <FcGoogle size={25} />Log in with Google</Button>

                <div className="flex items-center my-5">
                    <hr className="flex-1" />
                    <span className="mx-5">or</span>
                    <hr className="flex-1" />
                </div>

                <form onSubmit={handleSubmit((data) => handleSubmitMutation.mutate(data))}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Enter your email" {...register("email")} />
                            <Error message={errors.email?.message} />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="Enter your password" {...register("password")} />
                            <Error message={errors.password?.message} />
                        </div>

                        <SubmitButton isLoading={handleSubmitMutation.isLoading}>Sign Up</SubmitButton>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col justify-between ">
                <small className="flex items-center">Don't have account?
                    <Link href="/register" prefetch={true}>
                        <Button variant={`link`} className="p-0 h-0 ml-1 underline">Sign Up</Button>
                    </Link>
                </small>
            </CardFooter>
        </Card>
    </Section>
}

export default Page

