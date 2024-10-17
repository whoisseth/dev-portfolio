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
import { motion } from "framer-motion";

export function AlternatingLayout({
  projects,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="space-y-16 py-8 sm:py-12 md:py-16">
      {projects?.map((project: Project, index: number) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex flex-col overflow-hidden rounded-xl bg-card shadow-lg transition-all duration-300 hover:shadow-xl sm:flex-row ${
            index % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse"
          }`}
        >
          <div className="relative w-full sm:w-2/5 md:w-1/2">
            <img
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="h-64 w-full object-cover sm:h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-2xl font-bold text-white sm:hidden">
              {project.title}
            </h3>
          </div>
          <div className="flex w-full flex-col justify-between p-6 sm:w-3/5 md:w-1/2 md:p-8">
            <div>
              <h3 className="mb-3 hidden text-2xl font-bold sm:block md:text-3xl">
                {project.title}
              </h3>
              <p className="mb-4 text-sm text-muted-foreground sm:text-base">
                {project.description}
              </p>
              <div className="mb-4 flex flex-wrap gap-2">
                {project?.tags?.map((tech) => (
                  <Badge
                    key={tech}
                    variant="secondary"
                    className="px-2 py-1 text-xs font-medium sm:text-sm"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {project.liveLink && (
                  <Button
                    variant="default"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
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
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="w-full sm:w-auto"
                  >
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
                <div className="flex gap-2">
                  <UpdateProjectDialogComponent
                    userRoute={userRoute}
                    project={{ ...project, id: project.id! }}
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Pencil className="mr-2 h-3 w-3" /> Edit
                    </Button>
                  </UpdateProjectDialogComponent>
                  <DeleteProjectDialog
                    project={project}
                    routeName={userRoute.routeName}
                  >
                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full sm:w-auto"
                    >
                      <Trash className="mr-2 h-3 w-3" /> Delete
                    </Button>
                  </DeleteProjectDialog>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
