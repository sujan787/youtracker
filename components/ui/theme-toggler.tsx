"use client"

import { BsMoonStarsFill, BsSunFill } from "react-icons/bs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

import { Button } from "@/components/ui/button";
import { FC } from "react";
import { useTheme } from "next-themes";

interface ThemeTogglerProps {
}

const ThemeToggler: FC<ThemeTogglerProps> = () => {
    const { setTheme } = useTheme()

    return (<DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
                <BsSunFill className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <BsMoonStarsFill className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="p-1 border rounded-md mt-3 cursor-pointer w-28 bg-background">
            <DropdownMenuItem onClick={() => setTheme("light")} className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")} className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")} className="relative flex select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 cursor-pointer">
                System
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>);
}

export default ThemeToggler;