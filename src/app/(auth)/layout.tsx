import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

type Props = {};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-grow flex-col">
      <nav className=' container py-2'>
        <Link className={cn(buttonVariants({ variant: "outline" }))} href="/">
          Home
        </Link>
      </nav>
      {children}
    </div>
  );
}
