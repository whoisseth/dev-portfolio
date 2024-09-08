import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import { WorkExperienceDisplay } from "./_components/work-experience-display";

type Props = {};

export default function UserPage({}: Props) {
  return (
    <div>
      <Hero />
      <ProjectsSection />
      <WorkExperienceDisplay />
    </div>
  );
}
