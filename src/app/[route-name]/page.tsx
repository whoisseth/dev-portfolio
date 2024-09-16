import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import { WorkExperienceDisplay } from "./_components/work-experience-display";
import TogglePreviewBtn from "./_components/toggle-preview-btn";
import { getAboutMeWithRouteName } from "@/actions/create-portfolio-actions";
import { getCurrentUser } from "@/lib/session";

type Props = {
  params: { "route-name": string };
};

export default async function UserPage({ params }: Props) {
  const user = await getCurrentUser();
  const routeName = params["route-name"].split("/")[0]; // Get the first part after the domain

  const aboutMe = await getAboutMeWithRouteName(routeName);
  // console.log("About Me data:", aboutMe);

  return (
    <div className="relative">
      {/* {user?.id} */}
      {/* {user?.id && <TogglePreviewBtn className="fixed right-5 top-28 z-50" />} */}
      {aboutMe && <Hero user={user} aboutMe={aboutMe.about_me} />}
      <ProjectsSection />
      <WorkExperienceDisplay />
    </div>
  );
}
