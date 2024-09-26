"use client";

import React from "react";
import { buttonVariants } from "@/components/ui/button";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import { cn } from "@/lib/utils";
import { User } from "lucia";
import Link from "next/link";
import Notification from "@/components/notification";

type Props = {
  user: User | undefined;
};

export default function AddHeroSection({ user }: Props) {
  const canEdit = useCanEditPortfolio(user);
  if (!canEdit) return null;

  return (
    <>
      <Notification message="Project section issue fixed and updated." />
      <div className="mb-4 mt-1 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hero Section</h2>
        <Link
          className={cn(buttonVariants({ variant: "outline" }))}
          href="/create-portfolio"
        >
          Add Hero Section
        </Link>
      </div>
    </>
  );
}
