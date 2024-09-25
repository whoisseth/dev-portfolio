import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import {
  getHeroSectionData,
  getProjects,
  getUserRoute,
} from "@/actions/create-portfolio-actions";
import { getCurrentUser } from "@/lib/session";
import { WorkExperienceSection } from "./_components/work-experience-section";
import { getWorkExperiences } from "@/actions/create-portfolio-actions";

type Props = {
  params: { "route-name": string };
};

export default async function UserPage({ params }: Props) {
  const user = await getCurrentUser();
  const userRoute = await getUserRoute(user?.id || null);
  const routeName = params["route-name"].split("/")[0].toLowerCase(); // Get the first part after the domain
  const heroSection = await getHeroSectionData(routeName);
  const projects = await getProjects(routeName);
  const workExperiences = await getWorkExperiences(routeName);

  console.log("projects ---:", projects);

  return (
    <div className="relative ">

      

      {heroSection && (
        <Hero
        user={user}
        isProjectsEmpty={projects.length === 0}
        heroSection={heroSection.hero_section}
        routeName={routeName}
        />
      )}

   
      <ProjectsSection projects={projects} user={user} userRoute={userRoute} />
      <WorkExperienceSection
        user={user}
        userRoute={userRoute}
        workExperiences={workExperiences}
      />
    </div>
  );
}
