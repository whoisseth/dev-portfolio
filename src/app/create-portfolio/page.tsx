import React from "react";
import { CreatePortfolio } from "./_components/create-portfolio";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { getUserRoute } from "@/actions/route_actions";
import { getHeroSectionData } from "@/actions/hero_actions";

type Props = {};

export default async function CreatePortfolioPage({}: Props) {
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`);
  }

  const existingRoute = await getUserRoute(user?.id || null);
  const heroSection = await getHeroSectionData(existingRoute?.routeName || "");

  if (existingRoute?.routeName && heroSection?.hero_section) {
    redirect(`/${existingRoute.routeName}`);
  }

  return (
    <div className="flex flex-grow flex-col">
      <CreatePortfolio user={user} existingRoute={existingRoute} />
    </div>
  );
}
