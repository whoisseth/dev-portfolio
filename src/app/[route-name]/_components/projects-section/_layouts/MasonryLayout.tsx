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
import {
  CardHeader,
  CardContent,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

export function MasonryLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="columns-1 gap-6 sm:columns-2 lg:columns-3">
      {projects?.map((project: Project) => (
        <Card key={project.id} className="mb-6 break-inside-avoid">
          <CardHeader className="p-4">
            <img
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="h-auto w-full rounded-md object-cover"
            />
          </CardHeader>
          <CardContent className="p-4">
            <CardTitle className="mb-2 text-xl">{project.title}</CardTitle>
            <p
              className={`text-sm text-muted-foreground ${expandedDescriptions[project.id!] ? "" : "line-clamp-3"}`}
            >
              {project.description}
            </p>
            {project.description && project.description.length > 150 && (
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
            <div className="mt-2 flex flex-wrap gap-1">
              {project?.tags?.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-xs">
                  {tech}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter className="p-4 pt-0">
            <div className="flex w-full space-x-2">
              {project.liveLink && (
                <Button variant="outline" size="sm" asChild className="flex-1">
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
                <Button variant="outline" size="sm" asChild className="flex-1">
                  <Link
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-1 h-3 w-3" /> Code
                  </Link>
                </Button>
              )}
            </div>
          </CardFooter>
          {userRoute && canEdit && (
            <CardFooter className="p-4 pt-0">
              <div className="flex w-full gap-2">
                <UpdateProjectDialogComponent
                  userRoute={userRoute}
                  project={{ ...project, id: project.id! }}
                >
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="mr-1 h-3 w-3" /> Edit
                  </Button>
                </UpdateProjectDialogComponent>
                <DeleteProjectDialog project={project}>
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </DeleteProjectDialog>
              </div>
            </CardFooter>
          )}
        </Card>
      ))}
    </div>
  );
}
