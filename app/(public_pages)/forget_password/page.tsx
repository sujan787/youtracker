
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
import { FC } from 'react'
import { FcGoogle } from "react-icons/fc";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Section from '@/components/ui/section'
import { loginSchema } from "@/yup/shema"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

interface FormInput {
    email: string,
    password: string,
}

const Page: FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormInput>({
        defaultValues: {
            email: "", password: ""
        },

        resolver: yupResolver(loginSchema)
    })

    return <Section className="h-screen items-center justify-center">
        <Card className="w-[350px]">
            <CardHeader>
                <CardTitle className="text-center">Login Your Account</CardTitle>
                <CardDescription className="text-center">Deploy your new project in one-click.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button variant="outline" className="font-semibold flex gap-3 w-full">
                    <FcGoogle size={25} />Log in with Google</Button>

                <div className="flex items-center my-5">
                    <hr className="flex-1" />
                    <span className="mx-5">or</span>
                    <hr className="flex-1" />
                </div>

                <form onSubmit={handleSubmit((data) => {
                    console.log(data)
                })}>
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

                        <Button className="w-full" type="submit">Log In</Button>
                    </div>
                </form>
            </CardContent>

            <CardFooter className="flex flex-col justify-between ">
                <small className="flex items-center">Don't have account? <Button variant={`link`} className="p-0 h-0 ml-1">Sign Up</Button></small>
            </CardFooter>
        </Card>
    </Section>
}

export default Page