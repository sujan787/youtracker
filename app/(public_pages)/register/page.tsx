
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
import Section from '@/components/ui/section'
import { SignUpFormInput } from "@/type"
import SubmitButton from "@/components/ui/submit_button"
import { createUser } from "@/server_actions/user_action"
import { redirect } from 'next/navigation'
import { registerSchema } from "@/yup/shema"
import { signIn } from "next-auth/react"
import { useForm } from "react-hook-form"
import { useMutation } from "@tanstack/react-query"
import useToastMessage from "@/components/hooks/use-toast-message"
import { yupResolver } from "@hookform/resolvers/yup"

const Page = () => {
    const [setToasterMessage] = useToastMessage();

    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInput>({
        defaultValues: { name: "", email: "", password: "", confirm_password: "" },
        resolver: yupResolver(registerSchema)
    })

    const handleSubmitMutation = useMutation(async (formData: SignUpFormInput) => {
        const status = await createUser(formData);
        if (status.is_ok) { await signIn("email", { ...formData, redirect: false }) };
        return { ...status, user: formData };
    })

    React.useEffect(() => {
        if (!handleSubmitMutation.data) return;
        setToasterMessage(handleSubmitMutation.data?.message);
        if (handleSubmitMutation.data?.is_ok)
            redirect(`/verify-email/${handleSubmitMutation.data.user.email}`);
    }, [handleSubmitMutation.data])

    return <Section className="h-screen items-center justify-center">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-center">Create Account</CardTitle>
                <CardDescription className="text-center">Use all Seo Tools from one place</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => signIn("google")} variant={`outline`} className="font-semibold flex gap-3 w-full">
                    <FcGoogle size={25} />Sign in with Google</Button>

                <div className="flex items-center my-5">
                    <hr className="flex-1" />
                    <span className="mx-5">or</span>
                    <hr className="flex-1" />
                </div>

                <form onSubmit={handleSubmit(async (data) => handleSubmitMutation.mutate(data))}>
                    <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="name">Name</Label>
                            <Input disabled={handleSubmitMutation.isLoading} id="name" placeholder="Enter your first name" {...register("name")} />
                            <Error position="right" message={errors.name?.message} />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="email">Email</Label>
                            <Input disabled={handleSubmitMutation.isLoading} id="email" placeholder="Enter your email" {...register("email")} />
                            <Error position="right" message={errors.email?.message} />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="password">Password</Label>
                            <Input disabled={handleSubmitMutation.isLoading} type="password" id="password" placeholder="Enter your password" {...register("password")} />
                            <Error position="right" message={errors.password?.message} />
                        </div>

                        <div className="flex flex-col space-y-1.5">
                            <Label htmlFor="confirm_password">Confirm Password</Label>
                            <Input disabled={handleSubmitMutation.isLoading} type="password" id="confirm_password" placeholder="Confirm your password" {...register("confirm_password")} />
                            <Error position="right" message={errors.confirm_password?.message} />
                        </div>

                        <SubmitButton isLoading={handleSubmitMutation.isLoading} className="w-full relative">Sign Up</SubmitButton>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col justify-between ">
                <small className="flex items-center">Already have an account ?
                    <Link href="/login" prefetch={true}>
                        <Button variant={`link`} className="p-0 h-0 ml-1 underline"> Log In</Button>
                    </Link>
                </small>
            </CardFooter>
        </Card>
    </Section>
}

export default Page