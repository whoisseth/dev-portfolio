"use client";

import { Project } from "@/db/schema";
import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Pencil, Trash } from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";

export function ShowcaseLayout({ projects, userRoute, canEdit }: LayoutProps) {
  return (
    <div className="space-y-16">
      {projects?.map((project: Project, index: number) => (
        <div
          key={project.id}
          className={`flex flex-col ${index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} items-center gap-8`}
        >
          <div className="w-full lg:w-1/2">
            <img
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="w-full rounded-lg object-cover shadow-lg"
            />
          </div>
          <div className="w-full lg:w-1/2">
            <h3 className="mb-4 text-3xl font-bold">{project.title}</h3>
            <p className="mb-4 text-lg text-muted-foreground">
              {project.description}
            </p>
            <div className="mb-6 flex flex-wrap gap-2">
              {project?.tags?.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-sm"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {project.liveLink && (
                <Button variant="default" size="lg" asChild>
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> View Live Project
                  </Link>
                </Button>
              )}
              {project.codeLink && (
                <Button variant="outline" size="lg" asChild>
                  <Link
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4" /> View Code
                  </Link>
                </Button>
              )}
            </div>
            {userRoute && canEdit && (
              <div className="mt-4 flex gap-2">
                <UpdateProjectDialogComponent
                  userRoute={userRoute}
                  project={{ ...project, id: project.id! }}
                >
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </UpdateProjectDialogComponent>
                <DeleteProjectDialog project={project}>
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </DeleteProjectDialog>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
