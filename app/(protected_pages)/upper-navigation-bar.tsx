"use client"

import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Button, buttonVariants } from "../../components/ui/button";
import {
     DropdownMenu,
     DropdownMenuContent,
     DropdownMenuItem,
     DropdownMenuTrigger
} from "../../components/ui/dropdown-menu";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import { BsSearch } from "react-icons/bs";
import { FC } from 'react'
import Link from "next/link";
import React from "react";
import ThemeToggler from "../../components/ui/theme-toggler";
import VideoSearchBar from "./video-search-bar";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";

interface UpperNavigationBarProps {
}


const UpperNavigationBar: FC<UpperNavigationBarProps> = () => {
    return (
        <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full 
        border-b bg-background/95 backdrop-blur md:px-5'>
            <div className=" flex h-14 items-center justify-around selection">
                <div className="text-xl md:text-2xl font-semibold">
                    <Link href="/docs">
                        <span className="text-primary">Youtube</span><span>Mark</span>
                    </Link>
                </div>
                <div className="w-full absolute md:relative bg-popover z-10 md:z-0  top-0 px-3 pt-2 md:p-0">
                    {/* for large and medium screen */}
                    <div className="hidden md:block"> <VideoSearchBar /></div>
                </div>
                <div className="flex items-center justify-between space-x-2 md:justify-end">
                    {/* for small screen */}
                    <div className="md:hidden block">
                        <Popover>
                            <PopoverTrigger className={cn(buttonVariants(),
                                "border border-input bg-background hover:bg-accent hover:text-accent-foreground text-accent-foreground")}>
                                <BsSearch /></PopoverTrigger>
                            <PopoverContent className="mt-2 mr-1"><VideoSearchBar /></PopoverContent>
                        </Popover>
                    </div>
                    <ThemeToggler />
                    <ProfileDropDown />
                </div>
            </div>
        </header>
    )
}

export default UpperNavigationBar



const ProfileDropDown = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, title, children, ...props }, ref) => {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="p-1 border rounded-md mt-2 cursor-pointer w-28">
                <DropdownMenuItem className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                    Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => signOut()}
                    className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ProfileDropDown.displayName = "ProfileDropDown"