"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserNavigation from "@/components/user-navigation";
import { Profile } from "@/db/schema";
import { DropdownMenuContent } from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Github, LogIn, LogOut, UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { User } from "lucia";
import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"; // Assuming you have a Sheet component
import { Menu } from "lucide-react"; // Importing the Menu icon

type Props = {
  user: User | undefined;
  profile: Profile | undefined;
};

export default function SupportUsNavbar({ user, profile }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [isSheetOpen, setSheetOpen] = useState(false);

  function singOut() {
    startTransition(() => {
      router.push("/api/sign-out");
    });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">
          Portly
        </Link>

        <div className="flex items-center gap-6">
          <Link
            href="https://github.com/whoisseth/dev-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden text-muted-foreground hover:text-primary md:block"
          >
            <Github className="h-5 w-5" />
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="default" asChild>
              <Link href="/create-portfolio">Create Your Portfolio</Link>
            </Button>
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-0">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={profile?.image || "/default-avatar.png"}
                        alt="User Avatar"
                      />
                      <AvatarFallback className="capitalize">
                        {profile?.displayName?.charAt(0) || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <div>
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span className="font-semibold capitalize">
                        {profile?.displayName || "User"}
                      </span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <button className="w-full cursor-pointer" onClick={singOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      {isPending ? "Signing out..." : "Logout"}
                    </button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="group transition-colors duration-200"
                asChild
              >
                <Link
                  href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
                >
                  <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                  Login
                </Link>
              </Button>
            )}
          </div>

          

          {/* Mobile Sheet Trigger */}
          <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <div className="flex flex-col gap-4 pt-10">
                <Button variant="default" asChild>
                  <Link href="/create-portfolio">Create Your Portfolio</Link>
                </Button>
                {user ? (
                  <button onClick={singOut}>
                    {isPending ? "Signing out..." : "Logout"}
                  </button>
                ) : (
                  <Button
                    variant="outline"
                    className="group transition-colors duration-200"
                    asChild
                  >
                    <Link
                      href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
                    >
                      <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                      Login
                    </Link>
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="group transition-colors duration-200"
                  asChild
                >
                  <Link
                    href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}
