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
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

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
    <div className="relative py-2">
      {heroSection ? (
        <Hero
          user={user}
          isProjectsEmpty={projects.length === 0}
          heroSection={heroSection.hero_section}
          routeName={routeName}
        />
      ) : (
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold"> Hero Section</h2>
          <Link
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            href="/create-portfolio"
          >
            Add Hero Section
          </Link>
        </div>
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
