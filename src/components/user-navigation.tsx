"use server";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogIn, LogOut, User as UserIcon, ChevronDown } from "lucide-react";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { getProfile } from "@/data-access/profiles";
import { Suspense } from "react";

export default async function UserNavigation() {
  const user = await getCurrentUser();
  const profile = await getProfile(user?.id ?? 0);

  return user ? (
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
            <Suspense fallback={<div>Signing out...</div>}>
              <Link href="/api/sign-out" prefetch={false}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Link>
            </Suspense>
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
  );
}
