"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LogIn,
  LogOut,
  Menu as MenuIcon,
  User as UserIcon,
  ChevronDown,
  Github,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucia";
import { Profile } from "@/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";

type Props = {
  user: User | undefined;
  profile: Profile | undefined;
};

const navLinks = [
  {
    name: "Features",
    href: "#features",
  },
  {
    name: "How to Use",
    href: "#how-to-use",
  },
  {
    name: "FAQ",
    href: "#faq",
  },
  {
    name: "Support Us",
    href: "/support-us",
  },
];

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

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="https://github.com/whoisseth/dev-portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary"
          >
            <Github className="h-5 w-5" />
          </Link>
        </div>

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
                href={`/sign-in?returnTo=${encodeURIComponent(
                  "/create-portfolio",
                )}`}
              >
                <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                Login
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Sheet Trigger */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" className="md:hidden">
              <MenuIcon className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 pt-10">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-sm text-muted-foreground hover:text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
             
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
                    <Github className="h-5 w-5" />
                    GitHub
                  </Link>
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
                    href={`/sign-in?returnTo=${encodeURIComponent(
                      "/create-portfolio",
                    )}`}
                  >
                    <LogIn className="mr-2 h-4 w-4 transition-transform group-hover:scale-110" />
                    Login
                  </Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}
