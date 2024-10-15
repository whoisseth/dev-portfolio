"use client";

import { Project } from "@/db/schema";
import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Pencil, Trash } from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";

export function AlternatingLayout({
  projects,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="space-y-12">
      {projects?.map((project: Project, index: number) => (
        <div
          key={project.id}
          className={`flex flex-col ${index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-6 overflow-hidden rounded-lg bg-card shadow-md`}
        >
          <div className="w-full md:w-2/5">
            <img
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="h-64 w-full object-cover"
            />
          </div>
          <div className="w-full p-6 md:w-3/5">
            <h3 className="mb-2 text-2xl font-bold">{project.title}</h3>
            <p className="mb-4 text-muted-foreground">{project.description}</p>
            <div className="mb-4 flex flex-wrap gap-2">
              {project?.tags?.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {project.liveLink && (
                <Button variant="default" size="sm" asChild>
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-1 h-3 w-3" /> Live Demo
                  </Link>
                </Button>
              )}
              {project.codeLink && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-1 h-3 w-3" /> View Code
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
