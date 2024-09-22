"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github } from "lucide-react";
import { Project } from "@/db/schema";
import Link from "next/link";

export const ProjectCard = (project: Project) => {
  const [imgSrc, setImgSrc] = useState(project.imageUrl);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-4">
        <img
          src={imgSrc ?? "/images/placeholder.svg"}
          alt={project.title}
          // h-32 w-full
          className="aspect-[2/16]  w-full h-[174px] rounded-md object-cover"
          // className="aspect-[2/16] h-[174px] max-h-fit w-full rounded-md object-cover sm:w-[50%] md:w-[33.333333%]"
          onError={() => setImgSrc("/images/placeholder.svg")}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <CardTitle className="mb-1 text-lg">{project.title}</CardTitle>
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="mb-2 flex flex-wrap gap-1">
          {project?.tags?.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="px-2 py-0.5 text-xs"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex space-x-2 text-sm">
          {project.liveLink && (
            <Button variant="outline" size="sm" asChild>
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
            <Button variant="outline" size="sm" asChild>
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
    </Card>
  );
};
