"use client";

import { LayoutProps } from "..";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ExternalLink,
  Github,
  Pencil,
  Trash,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { UpdateProjectDialogComponent } from "../update-project-dialog";
import { DeleteProjectDialog } from "../delete-project-dialog";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function CarouselLayout({
  projects,
  expandedDescriptions,
  toggleDescription,
  userRoute,
  canEdit,
}: LayoutProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    if (carouselRef.current) {
      const scrollWidth = carouselRef.current.scrollWidth;
      const itemWidth = scrollWidth / projects.length;
      carouselRef.current.scrollTo({
        left: itemWidth * index,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    scrollToIndex(activeIndex);
  }, [activeIndex]);

  const handlePrev = () =>
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : projects.length - 1));
  const handleNext = () =>
    setActiveIndex((prev) => (prev < projects.length - 1 ? prev + 1 : 0));

  const activeProject = projects[activeIndex];

  return (
    <div className="space-y-8">
      <div className="relative">
        <div
          ref={carouselRef}
          className="scrollbar-hide flex snap-x snap-mandatory space-x-4 overflow-x-auto px-4 py-4"
        >
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`w-24 flex-shrink-0 cursor-pointer transition-all duration-300 sm:w-32 md:w-40 ${
                index === activeIndex
                  ? "scale-110 rounded-lg border-2 border-primary"
                  : "scale-100 opacity-70"
              }`}
              onClick={() => setActiveIndex(index)}
            >
              <img
                src={project.imageUrl || "/images/placeholder.svg"}
                alt={project.title}
                className="h-24 w-full rounded-lg object-cover sm:h-32 md:h-40"
              />
            </div>
          ))}
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={handlePrev}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm"
          onClick={handleNext}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <img
              src={activeProject.imageUrl || "/images/placeholder.svg"}
              alt={activeProject.title}
              className="h-64 w-full object-cover md:h-full"
            />
          </div>
          <CardContent className="w-full space-y-4 p-6 md:w-1/2">
            <h3 className="text-2xl font-bold">{activeProject.title}</h3>
            <div className="relative">
              <motion.div
                initial={false}
                animate={{
                  height: expandedDescriptions[activeProject.id!]
                    ? "auto"
                    : "4.5em",
                }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="text-sm text-muted-foreground">
                  {activeProject.description}
                </p>
              </motion.div>
              {!expandedDescriptions[activeProject.id!] && (
                <div
                  className="pointer-events-none absolute bottom-0 left-0 h-16 w-full bg-gradient-to-t from-background via-background/90 to-transparent"
                  style={{ transform: "translateY(8px)" }}
                />
              )}
            </div>
            {activeProject.description &&
              activeProject.description.length > 150 && (
                <Button
                  variant="link"
                  onClick={() => toggleDescription(activeProject.id!)}
                  className="mt-2 h-auto p-0 text-sm font-normal"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    {expandedDescriptions[activeProject.id!] ? (
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
            <div className="flex flex-wrap gap-2">
              {activeProject.tags?.map((tech) => (
                <Badge key={tech} variant="secondary">
                  {tech}
                </Badge>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeProject.liveLink && (
                <Button variant="default" size="sm" asChild>
                  <Link
                    href={activeProject.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
                  </Link>
                </Button>
              )}
              {activeProject.codeLink && (
                <Button variant="outline" size="sm" asChild>
                  <Link
                    href={activeProject.codeLink}
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
                  project={{ ...activeProject, id: activeProject.id! }}
                >
                  <Button variant="outline" size="sm">
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </Button>
                </UpdateProjectDialogComponent>
                <DeleteProjectDialog
                  project={activeProject}
                  routeName={userRoute.routeName}
                >
                  <Button variant="destructive" size="sm">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </DeleteProjectDialog>
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
