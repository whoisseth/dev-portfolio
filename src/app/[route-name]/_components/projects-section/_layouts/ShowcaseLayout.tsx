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

export function ShowcaseLayout({ projects, userRoute, canEdit }: LayoutProps) {
  return (
    <div className="space-y-24 py-12">
      {projects?.map((project: Project, index: number) => (
        <motion.div
          key={project.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className={`flex flex-col items-center gap-8 rounded-xl bg-gradient-to-br from-background to-background/50 p-8 shadow-lg transition-all duration-300 hover:shadow-xl sm:p-12 lg:flex-row ${
            index % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"
          }`}
        >
          <div className="w-full overflow-hidden rounded-lg lg:w-1/2">
            <motion.img
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="h-64 w-full object-cover shadow-md sm:h-80 lg:h-96"
            />
          </div>
          <div className="w-full space-y-6 lg:w-1/2">
            <h3 className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {project.title}
            </h3>
            <p className="text-lg leading-relaxed text-muted-foreground">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project?.tags?.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-3 py-1 text-sm font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              {project.liveLink && (
                <Button variant="default" size="lg" asChild className="group">
                  <Link
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:rotate-12" />
                    View Live Project
                  </Link>
                </Button>
              )}
              {project.codeLink && (
                <Button variant="outline" size="lg" asChild className="group">
                  <Link
                    href={project.codeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="mr-2 h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                    View Code
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
                  <Button variant="outline" size="sm" className="group">
                    <Pencil className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />{" "}
                    Edit
                  </Button>
                </UpdateProjectDialogComponent>
                <DeleteProjectDialog
                  project={project}
                  routeName={userRoute!.routeName!}
                >
                  <Button variant="destructive" size="sm" className="group">
                    <Trash className="mr-1 h-3 w-3 transition-transform duration-300 group-hover:rotate-12" />{" "}
                    Delete
                  </Button>
                </DeleteProjectDialog>
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
