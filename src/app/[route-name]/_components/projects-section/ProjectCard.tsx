"use client";

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
import { UpdateProjectDialogComponent } from "./update-project-dialog";
import { DeleteProjectDialog } from "./delete-project-dialog";

type props = {
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
  project: Project;
  canEdit: boolean;
};

export const ProjectCard = ({ project, userRoute, canEdit }: props) => {
  return (
    <Card className="relative flex h-full flex-col">
     
      {userRoute && canEdit && (
        <div className="absolute left-1 top-1 z-10 flex gap-2">
          <UpdateProjectDialogComponent
            userRoute={userRoute}
            project={project}
          />
          <DeleteProjectDialog project={project} />
        </div>
      )}
      <CardHeader className="p-4">
        <img
          src={
            project.imageUrl?.length && project.imageUrl?.length > 1
              ? project.imageUrl
              : "/images/placeholder.svg"
          }
          alt={project.title}
          // h-32 w-full
          className="aspect-[2/16] h-[174px] w-full rounded-md object-cover"
          // className="aspect-[2/16] h-[174px] max-h-fit w-full rounded-md object-cover sm:w-[50%] md:w-[33.333333%]"
          // onError={() => setImgSrc("/images/placeholder.svg")}
        />
      </CardHeader>
      <CardContent className="flex-grow p-4 pt-2">
        <CardTitle className="mb-1 text-lg capitalize">
          {project.title}
        </CardTitle>
        <p className="mb-2 line-clamp-2 text-sm capitalize text-muted-foreground">
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
          {/* linkLink */}
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
