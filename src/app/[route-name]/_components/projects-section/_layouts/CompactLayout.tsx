"use client";

import React from "react";
import { Project } from "@/db/schema";
import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Pencil,
  Trash,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function CompactLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="space-y-6">
      {projects?.map((project: Project) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden transition-shadow duration-300 hover:shadow-lg">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-1/3 md:w-1/4">
                  <img
                    src={project.imageUrl || "/images/placeholder.svg"}
                    alt={project.title}
                    className="h-48 w-full object-cover sm:h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent sm:hidden" />
                  <h3 className="absolute bottom-2 left-3 text-lg font-semibold text-white sm:hidden">
                    {project.title}
                  </h3>
                </div>
                <div className="flex w-full flex-col justify-between p-4 sm:w-2/3 md:w-3/4 md:p-6">
                  <div>
                    <h3 className="mb-2 hidden text-xl font-semibold sm:block md:text-2xl">
                      {project.title}
                    </h3>
                    <div className="mb-3">
                      <AnimatePresence initial={false}>
                        <motion.div
                          key={`${project.id}-${expandedDescriptions[project.id!]}`}
                          initial="collapsed"
                          animate="open"
                          exit="collapsed"
                          variants={{
                            open: { opacity: 1, height: "auto" },
                            collapsed: { opacity: 0, height: 0 },
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <p
                            className={`text-sm text-muted-foreground md:text-base ${expandedDescriptions[project.id!] ? "" : "line-clamp-2"}`}
                          >
                            {project.description}
                          </p>
                        </motion.div>
                      </AnimatePresence>
                      {project.description &&
                        project.description.length > 100 && (
                          <Button
                            variant="link"
                            onClick={() => toggleDescription(project.id!)}
                            className="mt-1 h-auto p-0 text-sm font-normal text-primary"
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
                    <div className="mb-4 flex flex-wrap gap-1.5">
                      {project?.tags?.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="px-2 py-0.5 text-xs font-medium"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {project.liveLink && (
                      <Button variant="default" size="sm" asChild>
                        <Link
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Live
                          Demo
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
                          <Github className="mr-1.5 h-3.5 w-3.5" /> View Code
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
                            <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                          </Button>
                        </UpdateProjectDialogComponent>
                        <DeleteProjectDialog project={project}>
                          <Button variant="destructive" size="sm">
                            <Trash className="mr-1.5 h-3.5 w-3.5" /> Delete
                          </Button>
                        </DeleteProjectDialog>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
