"use server";

import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePortfolioBtn from "./_components/create-portfolioBtn";
import { cn } from "@/lib/utils";

export default async function HomePage() {
  const user = await getCurrentUser();

  console.log("home user", user);

  return (
    <div className="flex flex-col flex-grow items-center justify-center gap-4">
      <div className="w-full max-w-xs space-y-4">
        {user ? (
          <Link
            prefetch={false}
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}
            href={"/api/sign-out"}
          >
            Log Out
          </Link>
        ) : (
          <Link
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full")}
            href={"/sign-in"}
          >
            Log In
          </Link>
        )}

        <Link
          className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full")}
          href={"/create-portfolio"}
        >
          Create Portfolio
        </Link>
      </div>
    </div>
  );
}
