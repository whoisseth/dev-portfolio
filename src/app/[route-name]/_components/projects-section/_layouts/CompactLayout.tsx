"use client";

import { Project } from "@/db/schema";
import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Pencil, Trash } from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";

export function CompactLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="space-y-4">
      {projects?.map((project: Project) => (
        <Card key={project.id} className="overflow-hidden">
          <div className="flex flex-col sm:flex-row">
            <div className="w-full sm:w-1/4">
              <img
                src={project.imageUrl || "/images/placeholder.svg"}
                alt={project.title}
                className="h-48 w-full object-cover sm:h-full"
              />
            </div>
            <div className="flex w-full flex-col justify-between p-4 sm:w-3/4">
              <div>
                <h3 className="mb-2 text-xl font-semibold">{project.title}</h3>
                <div className="mb-2">
                  <p
                    className={`text-sm text-muted-foreground ${expandedDescriptions[project.id!] ? "" : "line-clamp-2"}`}
                  >
                    {project.description}
                  </p>
                  {project.description && project.description.length > 100 && (
                    <Button
                      variant="link"
                      onClick={() => toggleDescription(project.id!)}
                      className="h-auto p-0 text-sm font-normal"
                    >
                      {expandedDescriptions[project.id!] ? (
                        <>
                          <ChevronUp className="mr-1 h-3 w-3" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-1 h-3 w-3" />
                          Show more
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <div className="mb-4 flex flex-wrap gap-1">
                  {project?.tags?.map((tech) => (
                    <Badge key={tech} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {project.liveLink && (
                  <Button variant="outline" size="sm" asChild>
                    <Link
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-1 h-3 w-3" /> Live
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
                      <Github className="mr-1 h-3 w-3" /> Code
                    </Link>
                  </Button>
                )}
                {canEdit && (
                  <>
                    <UpdateProjectDialogComponent
                      userRoute={userRoute!}
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
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
