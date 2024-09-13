"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Folder, Github } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Project {
  name: string;
  description: string;
  image: string;
  technologies: string[];
  liveUrl: string;
  codeUrl?: string;
}

const ProjectCard = ({ project }: { project: Project }) => {
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

const projects: Project[] = [
  {
    name: "E-commerce Platform",
    description:
      "Full-stack e-commerce solution with user auth, product management, and payments.",
    // image: "/placeholder.svg?height=200&width=300",
    image: "/images/Code-typing-bro.svg",
    technologies: ["React", "Node.js", "MongoDB"],
    liveUrl: "https://example-ecommerce.com",
    codeUrl: "https://github.com/example/ecommerce",
  },
  {
    name: "Weather App",
    description: "Responsive weather app with real-time data and forecasts.",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["Vue.js", "OpenWeatherMap API"],
    liveUrl: "https://example-weather-app.com",
    codeUrl: "https://github.com/example/weather-app",
  },
  {
    name: "Task Manager",
    description: "Collaborative task management tool with real-time updates.",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["Angular", "Firebase"],
    liveUrl: "https://example-task-manager.com",
    codeUrl: "https://github.com/example/task-manager",
  },
  {
    name: "Portfolio Website",
    description: "Personal portfolio showcasing projects and skills.",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["Next.js", "Tailwind CSS"],
    liveUrl: "https://example-portfolio.com",
  },
  {
    name: "Blog Platform",
    description: "Custom blog platform with CMS and user comments.",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["Django", "PostgreSQL"],
    liveUrl: "https://example-blog.com",
    codeUrl: "https://github.com/example/blog-platform",
  },
  {
    name: "Fitness Tracker",
    description: "Mobile app for tracking workouts and nutrition.",
    image: "/placeholder.svg?height=200&width=300",
    technologies: ["React Native", "GraphQL"],
    liveUrl: "https://example-fitness.com",
    codeUrl: "https://github.com/example/fitness-tracker",
  },
];

export function ProjectsSection() {
  return (
    <section id="projects" className="bg-background py-8">
      <h2 className="mb-6 text-2xl font-bold">My Projects</h2>
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((project) => (
          <ProjectCard key={project.name} project={project} />
        ))}
      </div>
      <div className="flex items-center">
        <Link
          href={"#projects"}
          className={cn(buttonVariants({ variant: "link" }), "mx-auto")}
        >
          <Folder size={20} className="mr-2" />
          View All Projects
        </Link>
      </div>
    </section>
  );
}
