import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";
import { WorkExperienceDisplay } from "./_components/work-experience-display";
import { ModeToggleComponent } from "@/components/mode-toggle";

type Props = {};

export default function UserPage({}: Props) {
  return (
    <div className="relative">
      {/* <ModeToggleComponent className="fixed top-28 right-5 z-50" /> */}
      <Hero />
      <ProjectsSection />
      <WorkExperienceDisplay />
    </div>
  );
}
