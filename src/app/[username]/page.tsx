import React from "react";
import { Hero } from "./_components/hero";
import { ProjectsSection } from "./_components/projects-section";

type Props = {};

export default function UserPage({}: Props) {
  return (
    <div>
      <Hero />
      <ProjectsSection />
    </div>
  );
}
