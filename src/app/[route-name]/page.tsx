import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import {
  getHeroSectionData,
  getLayoutStyle,
  getProjects,
  getUserRoute,
} from "@/actions/create-portfolio-actions";
import { getCurrentUser } from "@/lib/session";
import { WorkExperienceSection } from "./_components/work-experience-section";
import { getWorkExperiences } from "@/actions/create-portfolio-actions";
import AddHeroSection from "./_components/add-hero-section";

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
  const layoutStyle = await getLayoutStyle(routeName);

  return (
    <div className="relative">
      {/* container px-4 sm:px-8 */}
      {heroSection ? (
        <Hero
          user={user}
          layoutStyle={layoutStyle?.layout?.heroSectionLayoutStyle}
          isProjectsEmpty={projects.length === 0}
          heroSection={heroSection.hero_section}
          userRoute={userRoute}
        />
      ) : (
        <AddHeroSection user={user} />
      )}

      <ProjectsSection
        layoutStyle={layoutStyle?.layout?.projectLayoutStyle}
        projects={projects}
        user={user}
        userRoute={userRoute}
      />
      <WorkExperienceSection
        layoutStyle={layoutStyle?.layout?.workExperienceLayoutStyle}
        user={user}
        userRoute={userRoute}
        workExperiences={workExperiences}
      />
    </div>
  );
}
