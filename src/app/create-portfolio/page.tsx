import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CreatePortfolio } from "./_components/create-portfolio";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { getUserRoute } from "@/actions/create-portfolio-actions";

type Props = {};

export default async function CreatePortfolioPage({}: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }
  const existingRoute = await getUserRoute(user.id);
  if (existingRoute) {
    redirect(`/${existingRoute}`);
  }

  return (
    <div className="flex flex-col flex-grow">
      <CreatePortfolio user={user} />
    </div>
  );
}
