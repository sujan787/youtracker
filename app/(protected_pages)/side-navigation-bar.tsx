"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import { BsFillPlayCircleFill } from "react-icons/bs";
import { FC } from "react";
import { ImFolderDownload } from "react-icons/im";
import { IoLogoYoutube } from "react-icons/io";
import Link from "next/link";
import { NavMenusTypes } from "@/type";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

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

const NavLinks: FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const activeRoute = usePathname();

  return (
    <nav className="flex flex-col gap-1 p-3">
      {navMenus.map((menu) => {
        const isActive = activeRoute?.includes(menu.route);
        const link = (
          <Link
            href={menu.route}
            prefetch={true}
            onClick={onNavigate}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            )}
          >
            {menu.icon}
            {menu.title}
          </Link>
        );

        return onNavigate ? (
          <SheetClose asChild key={menu.route}>{link}</SheetClose>
        ) : (
          <div key={menu.route}>{link}</div>
        );
      })}
    </nav>
  );
};

const SideNavigationBar: FC = () => {
  return (
    <>
      {/* large and medium screens */}
      <aside className="hidden md:block w-56 shrink-0 border-r bg-background/40 md:h-[calc(100vh-4rem)]">
        <NavLinks />
      </aside>

      {/* small screens */}
      <div className="block md:hidden fixed z-50">
        <Sheet>
          <SheetTrigger className="block border border-t-0 p-2.5 rounded-br-lg bg-background/80 backdrop-blur">
            <Menu size={22} />
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="px-4 py-4 border-b">
              <SheetTitle className="text-left text-lg font-bold tracking-tight">
                <span className="text-primary">You</span>Mark
              </SheetTitle>
            </SheetHeader>
            <NavLinks onNavigate={() => undefined} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}

export default SideNavigationBar;
