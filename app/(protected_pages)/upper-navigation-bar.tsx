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
import { VideoSearchInput } from "@/type";
import { cn } from "@/lib/utils";
import { LogOut, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useGlobalState } from "@/components/hooks/use-global-state";
import useLocalStorage from "@/components/hooks/use-local-storage";
import { useSearchParams } from "next/navigation";

interface UpperNavigationBarProps {
}


const UpperNavigationBar: FC<UpperNavigationBarProps> = () => {

    const searchParams = useSearchParams()

    const [data, setData] = useGlobalState<VideoSearchInput>("search_items", { keyword: "", playlist_id: "" })

    const { storedValue, setValue } = useLocalStorage('searchParams', data);

    React.useEffect(() => {
        if (searchParams.get('keyword') || searchParams.get('playlist_id')) {
            setData({
                keyword: searchParams.get('keyword') ?? "",
                playlist_id: searchParams.get('playlist_id') ?? ""
            })

            return;
        };

        if (!storedValue) return;
        setData(storedValue)
    }, [storedValue]);

    return (
        <header className='supports-backdrop-blur:bg-background/60 sticky top-0 z-40 w-full
        border-b bg-background/80 backdrop-blur-xl md:px-5'>
            <div className=" flex h-16 items-center justify-around selection">
                <div className="text-xl md:text-2xl font-bold tracking-tight">
                    <Link href="/videos" className="flex items-center gap-1">
                        <span className="text-primary">You</span><span>Mark</span>
                    </Link>
                </div>
                <div className="w-full absolute md:relative bg-popover z-10 md:z-0  top-0 px-3 pt-2 md:p-0">
                    {/* for large and medium screen */}
                    <div className="hidden md:block">
                        <VideoSearchBar data={data} setData={setData} storedValue={storedValue} setValue={setValue} />
                    </div>
                </div>

                <div className="flex items-center justify-between space-x-2 md:justify-end">
                    {/* for small screen */}
                    <div className="md:hidden block">
                        <Popover>
                            <PopoverTrigger className={cn(buttonVariants(),
                                "border border-input bg-background hover:bg-accent hover:text-accent-foreground text-accent-foreground")}>
                                <BsSearch />
                            </PopoverTrigger>

                            <PopoverContent className="mt-2 mr-1">
                                <VideoSearchBar data={data} setData={setData} storedValue={storedValue} setValue={setValue} />
                            </PopoverContent>
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
    const { data: session } = useSession();
    const user = session?.user;
    const initials = (user?.name ?? user?.email ?? "U")
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-9 w-9 border">
                        <AvatarImage src={(user as any)?.image ?? undefined} alt={user?.name ?? "Profile"} />
                        <AvatarFallback className="bg-primary/10 text-primary font-medium">{initials}</AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 mt-2 p-1">
                <div className="flex flex-col gap-0.5 px-2 py-1.5">
                    <p className="text-sm font-medium leading-none truncate">{user?.name ?? "Account"}</p>
                    {user?.email && (
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    )}
                </div>
                <div className="my-1 h-px bg-border" />
                <DropdownMenuItem className="cursor-pointer gap-2">
                    <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                    <LogOut size={16} /> Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})

ProfileDropDown.displayName = "ProfileDropDown"