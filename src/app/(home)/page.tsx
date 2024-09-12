"use server";

import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePortfolioBtn from "./_components/create-portfolioBtn";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  console.log("home user", user);

  return (
    <div className="container flex min-h-screen items-center justify-center gap-2">
      <div>
        {user ? (
          <Link
            prefetch={false}
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={"/api/sign-out"}
          >
            Log Out
          </Link>
        ) : (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={"/sign-in"}
          >
            Log In
          </Link>
        )}
      </div>

      <Link
        className={cn(buttonVariants({ variant: "default" }))}
        href={"/create-portfolio"}
      >
        Create Portfolio
      </Link>
    </div>
  );
}
