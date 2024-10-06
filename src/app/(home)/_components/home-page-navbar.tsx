"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  MenuIcon,
  User as UserIcon,
  ChevronDown,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucia";
import { Profile } from "@/db/schema";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

type Props = {
  user: User | undefined;
  profile: Profile | undefined;
};

export default function HomePageNavbar({ user, profile }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

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

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#how-to-use"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            How to Use
          </Link>
          <Link
            href="#faq"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            FAQ
          </Link>
          <Link
            href="/support-us"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Support Us
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Button variant="default" asChild>
                <Link href="/create-portfolio">Create Your Portfolio</Link>
              </Button>
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
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="default" asChild>
                <Link href="/create-portfolio">Create Your Portfolio</Link>
              </Button>
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
            </div>
          )}
        </div>

        <div className="md:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(!isOpen)}
          >
            <MenuIcon />
          </Button>
        </div>
      </nav>

      {isOpen && (
        <div className="container mx-auto mt-4 flex flex-col items-start gap-4 pb-4 md:hidden">
          <Link
            href="#features"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Features
          </Link>
          <Link
            href="#how-to-use"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            How to Use
          </Link>
          <Link
            href="#faq"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            FAQ
          </Link>
          <Link
            href="/support-us"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Support Us
          </Link>
          <Button variant="default" asChild className="w-full">
            <Link href="/create-portfolio">Create Your Portfolio</Link>
          </Button>
          {user ? (
            <Button variant="outline" asChild className="w-full">
              <Link href="/api/sign-out" prefetch={false}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Button>
          ) : (
            <Button variant="outline" asChild className="w-full">
              <Link
                href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
              >
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      )}
    </header>
  );
}
