"use client";

import React from "react";
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
  Calendar,
} from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function TimelineLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null);

  return (
    <div className="relative px-4 py-16 sm:px-6 lg:px-8">
      <div className="absolute bottom-0 left-4 top-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent sm:left-1/2" />
      {projects.map((project, index) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`mb-16 flex flex-col ${
            index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
          }`}
        >
          <div className="flex items-center sm:w-1/2">
            <div
              className={`relative w-full ${index % 2 === 0 ? "sm:pr-8" : "sm:pl-8"}`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="absolute -left-4 top-0 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-lg sm:left-auto sm:right-0"
              >
                <Calendar className="h-4 w-4" />
              </motion.div>
              <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl">
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={project.imageUrl || "/images/placeholder.svg"}
                      alt={project.title}
                      className="h-48 w-full object-cover sm:h-64"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white sm:hidden">
                      {project.title}
                    </h3>
                  </div>
                  <div className="space-y-4 p-6">
                    <h3 className="hidden text-2xl font-bold text-primary sm:block">
                      {project.title}
                    </h3>
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
                          className={`text-muted-foreground ${
                            expandedDescriptions[project.id!] ||
                            activeIndex === index
                              ? ""
                              : "line-clamp-3"
                          }`}
                        >
                          {project.description}
                        </p>
                      </motion.div>
                    </AnimatePresence>
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
                          className="mt-2 h-auto p-0 text-sm font-normal text-secondary-foreground"
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
                        <DeleteProjectDialog
                          project={project}
                          routeName={userRoute!.routeName!}
                        >
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
          <div className="hidden sm:block sm:w-1/2" />
        </motion.div>
      ))}
    </div>
  );
}
