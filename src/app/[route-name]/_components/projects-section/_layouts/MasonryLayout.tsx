"use client";

import React from "react";
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
import { motion, AnimatePresence } from "framer-motion";

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
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  height: expandedDescriptions[project.id!] ? "auto" : "4.5em",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground">
                  {project.description}
                </p>
              </motion.div>
              {!expandedDescriptions[project.id!] && (
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-background via-background/90 to-transparent"
                  style={{ transform: "translateY(8px)" }}
                />
              )}
            </div>
            {project.description && project.description.length > 150 && (
              <Button
                variant="link"
                onClick={() => toggleDescription(project.id!)}
                className="mt-2 h-auto p-0 text-sm font-normal"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {expandedDescriptions[project.id!] ? (
                    <motion.div
                      key="less"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronUp className="mr-1 inline-block h-4 w-4" />
                      Show less
                    </motion.div>
                  ) : (
                    <motion.div
                      key="more"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="mr-1 inline-block h-4 w-4" />
                      Show more
                    </motion.div>
                  )}
                </AnimatePresence>
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
