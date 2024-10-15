"use client";

import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Pencil, Trash } from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ChevronDown, ChevronUp } from "lucide-react";
import { CardContent } from "@/components/ui/card";
import { useState } from "react";
import { Calendar } from "lucide-react";

export function TimelineLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="relative px-4 py-12 md:px-6 lg:px-8">
      <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent md:left-1/2" />
      {projects.map((project, index) => (
        <div
          key={project.id}
          className={`mb-16 flex flex-col ${
            index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
          }`}
        >
          <div className="flex items-center md:w-1/2">
            <div
              className={`relative ${index % 2 === 0 ? "md:pr-8" : "md:pl-8"}`}
            >
              <div className="absolute -left-4 top-0 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg md:left-auto md:right-0">
                <Calendar className="h-4 w-4" />
              </div>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <img
                    src={project.imageUrl || "/images/placeholder.svg"}
                    alt={project.title}
                    className="h-48 w-full object-cover md:h-64"
                  />
                  <div className="space-y-4 p-6">
                    <h3 className="text-2xl font-bold text-primary">
                      {project.title}
                    </h3>
                    <div>
                      <p
                        className={`text-muted-foreground ${
                          expandedDescriptions[project.id!] ||
                          activeIndex === index
                            ? ""
                            : "line-clamp-3"
                        }`}
                      >
                        {project.description}
                      </p>
                      {project.description &&
                        project.description.length > 150 && (
                          <Button
                            variant="link"
                            onClick={() => {
                              toggleDescription(project.id!);
                              setActiveIndex(
                                activeIndex === index ? null : index,
                              );
                            }}
                            className="text-md mt-2 h-auto p-0 font-normal text-secondary-foreground"
                          >
                            {expandedDescriptions[project.id!] ||
                            activeIndex === index ? (
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
                    <div className="flex flex-wrap gap-2">
                      {project.tags?.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="bg-accent text-accent-foreground"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.liveLink && (
                        <Button
                          variant="default"
                          size="sm"
                          asChild
                          className="bg-primary hover:bg-primary/90"
                        >
                          <Link
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
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
                            <Github className="mr-2 h-4 w-4" /> View Code
                          </Link>
                        </Button>
                      )}
                    </div>
                    {canEdit && userRoute && (
                      <div className="flex gap-2">
                        <UpdateProjectDialogComponent
                          userRoute={userRoute}
                          project={{ ...project, id: project.id! }}
                        >
                          <Button variant="outline" size="sm">
                            <Pencil className="mr-2 h-4 w-4" /> Edit
                          </Button>
                        </UpdateProjectDialogComponent>
                        <DeleteProjectDialog project={project}>
                          <Button variant="destructive" size="sm">
                            <Trash className="mr-2 h-4 w-4" /> Delete
                          </Button>
                        </DeleteProjectDialog>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          <div className="hidden md:block md:w-1/2" />
        </div>
      ))}
    </div>
  );
}
