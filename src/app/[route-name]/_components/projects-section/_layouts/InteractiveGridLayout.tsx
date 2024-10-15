'use client'

import { useState } from "react";
import { LayoutProps } from "..";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Maximize,
  Maximize2,
  Minimize,
  Minimize2,
  Pencil,
  Trash,
  X,
} from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";

export function InteractiveGridLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <motion.div key={project.id} layoutId={`card-${project.id}`}>
          <Card
            className="flex h-full cursor-pointer flex-col"
            onClick={() => setSelectedId(project.id!)}
          >
            <div className="relative">
              <img
                src={project.imageUrl || "/images/placeholder.svg"}
                alt={project.title}
                className="h-48 w-full rounded-t-lg object-cover"
              />
              <div className="absolute right-2 top-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedId(project.id!);
                  }}
                >
                  <Maximize className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <CardContent className="flex flex-grow flex-col justify-between p-4">
              <div>
                <h3 className="mb-2 text-lg font-semibold">{project.title}</h3>
                <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {project.tags?.slice(0, 3).map((tech) => (
                  <Badge key={tech} variant="secondary" className="text-xs">
                    {tech}
                  </Badge>
                ))}
                {project.tags && project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      <AnimatePresence>
        {selectedId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              layoutId={`card-${selectedId}`}
              className="w-full max-w-2xl overflow-hidden rounded-lg bg-card shadow-lg"
            >
              {projects.map((project) => {
                if (project.id === selectedId) {
                  return (
                    <div key={project.id} className="relative">
                      <img
                        src={project.imageUrl || "/images/placeholder.svg"}
                        alt={project.title}
                        className="h-64 w-full object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-2 top-2"
                        onClick={() => setSelectedId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="p-6">
                        <h3 className="mb-2 text-2xl font-bold">
                          {project.title}
                        </h3>
                        <p
                          className={`mb-4 text-muted-foreground ${
                            expandedDescriptions[project.id!]
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
                              onClick={() => toggleDescription(project.id!)}
                              className="mb-4"
                            >
                              {expandedDescriptions[project.id!] ? (
                                <>
                                  <Minimize className="mr-2 h-4 w-4" />
                                  Show less
                                </>
                              ) : (
                                <>
                                  <Maximize className="mr-2 h-4 w-4" />
                                  Show more
                                </>
                              )}
                            </Button>
                          )}
                        <div className="mb-4 flex flex-wrap gap-2">
                          {project.tags?.map((tech) => (
                            <Badge key={tech} variant="secondary">
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
                                <ExternalLink className="mr-2 h-4 w-4" /> Live
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
                                <Github className="mr-2 h-4 w-4" /> View Code
                              </Link>
                            </Button>
                          )}
                        </div>
                        {canEdit && userRoute && (
                          <div className="mt-4 flex gap-2">
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
                    </div>
                  );
                }
                return null;
              })}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
