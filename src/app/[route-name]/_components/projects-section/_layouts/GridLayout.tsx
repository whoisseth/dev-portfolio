import React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

const MotionCard = motion(Card);

export function GridLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {projects?.map((project: Project, index: number) => (
        <MotionCard
          key={project.id}
          className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 ease-in-out hover:shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <div className="relative h-48 overflow-hidden">
            <motion.img
              src={project.imageUrl || "/images/placeholder.svg"}
              alt={project.title}
              className="h-full w-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
              initial={{ scale: 1 }}
              whileHover={{ scale: 1.05 }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          </div>

          <CardContent className="relative z-10 p-6">
            <h3 className="mb-2 text-xl font-bold">{project.title}</h3>

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

            {project.description && project.description.length > 100 && (
              <Button
                variant="link"
                onClick={() => toggleDescription(project.id!)}
                className="mt-2 h-auto p-0 text-sm font-medium"
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

            <div className="mt-4 flex flex-wrap gap-2">
              {project?.tags?.map((tech) => (
                <Badge
                  key={tech}
                  variant="secondary"
                  className="px-2 py-1 text-xs font-medium"
                >
                  {tech}
                </Badge>
              ))}
            </div>

            <div className="mt-6 flex space-x-3">
              {project.liveLink && (
                <Button variant="outline" size="sm" asChild className="flex-1">
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
                <Button variant="outline" size="sm" asChild className="flex-1">
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
              <div className="mt-4 flex space-x-3">
                <UpdateProjectDialogComponent
                  userRoute={userRoute}
                  project={{ ...project, id: project.id! }}
                >
                  <Button variant="outline" size="sm" className="flex-1">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </UpdateProjectDialogComponent>
                <DeleteProjectDialog
                  project={project}
                  routeName={userRoute!.routeName!}
                >
                  <Button variant="destructive" size="sm" className="flex-1">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DeleteProjectDialog>
              </div>
            )}
          </CardContent>
        </MotionCard>
      ))}
    </div>
  );
}

export default GridLayout;
