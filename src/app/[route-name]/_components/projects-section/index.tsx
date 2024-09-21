"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Folder, Plus } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ProjectCard } from "./ProjectCard";
import { projects } from "./data";
import { AddProjectDialogComponent } from "./add-project-dialog";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import { User as UserType } from "lucia";
import { Suspense } from "react";
import { UserRoute } from "@/db/schema";

type ProjectSectionType = {
  user: UserType | undefined;
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
};

export function ProjectsSection({ user, userRoute }: ProjectSectionType) {
  const canEdit = useCanEditPortfolio(user);

  return (
    <section id="projects" className="bg-background py-8">
      <section className="mb-6 flex w-full items-center justify-between gap-2">
        <h2 className="text-2xl font-bold">My Projects</h2>
        {/* <Button>
          <Plus  size={16} className="mr-2" />
          Add Project
        </Button> */}
        <Suspense fallback={"Loading..."}>
          {canEdit && userRoute && (
            <AddProjectDialogComponent userRoute={userRoute} />
          )}
        </Suspense>
      </section>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <div className="flex items-center">
        <Link
          href={"#projects"}
          className={cn(buttonVariants({ variant: "link" }), "mx-auto")}
        >
          <Folder size={20} className="mr-2" />
          View All Projects
        </Link>
      </div>
    </section>
  );
}
