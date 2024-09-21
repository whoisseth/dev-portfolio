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

export interface Project {
  name: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  codeUrl?: string;
}

export const ProjectCard = ({ project }: { project: Project }) => {
  const [imgSrc, setImgSrc] = useState(project.image);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader className="p-4">
        <img
          // src={'/images/placeholder.svg'}
          src={imgSrc}
          alt={project.name}
          className="h-32 w-full rounded-md object-cover"
          onError={() => setImgSrc("/images/placeholder.svg")}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <CardTitle className="mb-1 text-lg">{project.name}</CardTitle>
        <p className="mb-2 line-clamp-2 text-sm text-muted-foreground">
          {project.description}
        </p>
        <div className="mb-2 flex flex-wrap gap-1">
          {project.technologies.map((tech) => (
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
          <Button variant="outline" size="sm" asChild>
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="mr-1 h-3 w-3" /> Live
            </a>
          </Button>
          {project.codeUrl && (
            <Button variant="outline" size="sm" asChild>
              <a
                href={project.codeUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Github className="mr-1 h-3 w-3" /> Code
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};
