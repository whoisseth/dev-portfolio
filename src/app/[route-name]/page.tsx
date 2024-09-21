import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import { WorkExperienceDisplay } from "./_components/work-experience-display";
import TogglePreviewBtn from "./_components/toggle-preview-btn";
import {
  getHeroSectionData,
  getUserRoute,
} from "@/actions/create-portfolio-actions";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: { "route-name": string };
};

export default async function UserPage({ params }: Props) {
  const user = await getCurrentUser();
  const userRoute = await getUserRoute(user?.id || null);
  const routeName = params["route-name"].split("/")[0]; // Get the first part after the domain
  const heroSection = await getHeroSectionData(routeName);

  // console.log("heroSection data:", heroSection);

  return (
    <div className="relative">
      {heroSection && (
        <Hero user={user} heroSection={heroSection.hero_section} />
      )}

      <ProjectsSection user={user} userRoute={userRoute} />
      <WorkExperienceDisplay />
    </div>
  );
}
