"use client";

import * as React from "react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
  const [returnTo, setReturnTo] = React.useState("/");

  React.useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    setReturnTo(searchParams.get("returnTo") || "/");
  }, []);

  return (
    <div className="flex flex-grow flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-muted-foreground">
            Sign in to your account using one of the options below.
          </p>
        </div>
        <div className="space-y-4">
          <Link
            href={`/api/login/google?returnTo=${encodeURIComponent(returnTo)}`}
            className={cn(buttonVariants({ variant: "default" }), "w-full")}
          >
            <FcGoogle size={24} className="mr-2" />
            Sign in with Google
          </Link>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          <Link
            href={`/api/login/github?returnTo=${encodeURIComponent(returnTo)}`}
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
          >
            <FaGithub size={24} className="mr-2" />
            Sign in with GitHub
          </Link>
        </div>
      </div>
    </div>
  );
}
