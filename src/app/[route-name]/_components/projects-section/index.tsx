"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
// import { projects } from "./data";
import { AddProjectDialogComponent } from "./add-project-dialog";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import { User as UserType } from "@/lib/session";
import { Suspense } from "react";
import { Project } from "@/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";

type ProjectSectionType = {
  user: UserType | undefined;
  projects: Project[];
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
};

export function ProjectsSection({
  user,
  userRoute,
  projects,
}: ProjectSectionType) {
  const canEdit = useCanEditPortfolio(user);
  const [animationParent] = useAutoAnimate();

  return (
    <div className='py-4'>
    <section id="projects" className="mx-auto  container px-4 sm:px-8   ">
      {(projects.length > 0 || canEdit) && (
        <section className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">My Projects</h2>
          {userRoute && canEdit && (
            <AddProjectDialogComponent userRoute={userRoute} />
          )}
        </section>
      )}
      {projects.length > 0 && (
        <div
          ref={animationParent}
          className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {projects?.map((project, i) => (
            <ProjectCard
              canEdit={canEdit}
              userRoute={userRoute}
              key={i}
              project={project}
            />
          ))}
        </div>
      )}
    </section>
    </div>

  );
}
