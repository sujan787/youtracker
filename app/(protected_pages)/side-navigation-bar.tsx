import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet"

import { BsFillPlayCircleFill } from "react-icons/bs";
import { FC } from "react";
import { ImFolderDownload } from "react-icons/im";
import { IoLogoYoutube } from "react-icons/io";
import Link from "next/link";
import { NavMenusTypes } from "@/type";
import React from "react";
import { RiMenuUnfoldFill } from "react-icons/ri";
import { cn } from "@/lib/utils";
import { routes } from "@/routes";
import { usePathname } from "next/navigation";

interface SideNavigationBarProps {
}
const navMenus: NavMenusTypes = [
  {
    title: "Videos",
    route: "/videos",
    icon: <IoLogoYoutube size={20} />
  },
  {
    title: "Play Lists",
    route: "/playlists",
    icon: <BsFillPlayCircleFill size={20} />
  },
  {
    title: "Downloader",
    route: "/download" as any,
    icon: <ImFolderDownload size={20} />
  },
]

const SideNavigationBar: FC<SideNavigationBarProps> = () => {
  const activeRoute = usePathname();

  const getNavMenuStyle = (routeName: typeof routes[number]) => {
    const classStrings = activeRoute.includes(routeName) ? "bg-accent" : "";
    return cn(`${classStrings} cursor-pointer w-full cursor-pointer py-3 flex gap-2`);
  }

  return (
    <>
      {/* for large and medium screen */}
      <div className="hidden md:block">
        <Menubar className="flex gap-2 flex-col h-full md:h-[93.7vh] md:border-t-0 md:rounded-none  text-muted-foreground">
          {navMenus.map((menu, index) => (
            <Link href={menu.route} prefetch={true} key={menu.route} className="w-full">
              <MenubarMenu>
                <MenubarTrigger className={getNavMenuStyle(menu.route)}>
                  {menu.icon} {menu.title}
                </MenubarTrigger>
              </MenubarMenu>
            </Link>
          ))}
        </Menubar>
      </div>

      {/* for small screen */}
      <div className="block md:hidden fixed z-50 bg-background">
        <Sheet>
          <SheetTrigger className="block">
            <RiMenuUnfoldFill size={40} className=" border border-t-0 p-2" />
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <Menubar className="flex gap-2 flex-col h-full md:h-[93.7vh] md:border-t-0 md:rounded-none  text-muted-foreground">
                {navMenus.map((menu, index) => (
                  <SheetClose asChild key={menu.route}>
                    <Link href={menu.route} prefetch={true} className="w-full">
                      <MenubarMenu>
                        <MenubarTrigger className={getNavMenuStyle(menu.route)}>
                          {menu.icon} {menu.title}
                        </MenubarTrigger>
                      </MenubarMenu>
                    </Link>
                  </SheetClose>
                ))}
              </Menubar>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      </div >
    </>
  )
}

export default SideNavigationBar;
