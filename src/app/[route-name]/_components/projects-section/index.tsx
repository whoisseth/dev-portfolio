"use client";

import { AddProjectDialogComponent } from "./add-project-dialog";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import { User as UserType } from "@/lib/session";
import { Project } from "@/db/schema";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Grid, Columns, Layout, Layers, Maximize, Clock } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { GridLayout } from "./_layouts/GridLayout";
import { MasonryLayout } from "./_layouts/MasonryLayout";
import { ShowcaseLayout } from "./_layouts/ShowcaseLayout";
import { AlternatingLayout } from "./_layouts/AlternatingLayout";
import { CompactLayout } from "./_layouts/CompactLayout";
import { CarouselLayout } from "./_layouts/CarouselLayout";
import { InteractiveGridLayout } from "./_layouts/InteractiveGridLayout";
import { TimelineLayout } from "./_layouts/TimelineLayout";
import { useState } from "react";

type ProjectSectionType = {
  user: UserType | undefined;
  projects: Project[];
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
};

export type LayoutStyle =
  | "grid"
  | "masonry"
  | "showcase"
  | "alternating"
  | "compact"
  | "carousel"
  | "interactiveGrid"
  | "timeline";

export type LayoutProps = {
  projects: Project[];
  expandedDescriptions: { [key: number]: boolean };
  toggleDescription: (projectId: number) => void;
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
  canEdit: boolean;
};

export function ProjectsSection({
  user,
  userRoute,
  projects,
}: ProjectSectionType) {
  const canEdit = useCanEditPortfolio(user);
  const [animationParent] = useAutoAnimate();
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>("grid");
  const [expandedDescriptions, setExpandedDescriptions] = useState<{
    [key: number]: boolean;
  }>({});

  const toggleDescription = (projectId: number) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const renderProjects = () => {
    const props = {
      projects,
      expandedDescriptions,
      toggleDescription,
      userRoute,
      canEdit,
    };
    switch (layoutStyle) {
      case "grid":
        return <GridLayout {...props} />;
      case "masonry":
        return <MasonryLayout {...props} />;
      case "showcase":
        return <ShowcaseLayout {...props} />;
      case "alternating":
        return <AlternatingLayout {...props} />;
      case "compact":
        return <CompactLayout {...props} />;
      case "carousel":
        return <CarouselLayout {...props} />;
      case "interactiveGrid":
        return <InteractiveGridLayout {...props} />;
      case "timeline":
        return <TimelineLayout {...props} />;
      default:
        return <GridLayout {...props} />;
    }
  };

  return (
    <div className="py-8">
      <section id="projects" className="container mx-auto px-4">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <h2 className="text-3xl font-bold">My Projects</h2>
          <div className="flex items-center space-x-4">
            {canEdit && (
              <Select
                value={layoutStyle}
                onValueChange={(value: LayoutStyle) => setLayoutStyle(value)}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a layout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grid">
                    <div className="flex items-center">
                      <Grid className="mr-2 h-4 w-4" />
                      Grid
                    </div>
                  </SelectItem>
                  <SelectItem value="masonry">
                    <div className="flex items-center">
                      <Columns className="mr-2 h-4 w-4" />
                      Masonry
                    </div>
                  </SelectItem>
                  <SelectItem value="showcase">
                    <div className="flex items-center">
                      <Maximize className="mr-2 h-4 w-4" />
                      Showcase
                    </div>
                  </SelectItem>
                  <SelectItem value="alternating">
                    <div className="flex items-center">
                      <Layout className="mr-2 h-4 w-4" />
                      Alternating
                    </div>
                  </SelectItem>
                  <SelectItem value="compact">
                    <div className="flex items-center">
                      <Layers className="mr-2 h-4 w-4" />
                      Compact
                    </div>
                  </SelectItem>
                  <SelectItem value="carousel">
                    <div className="flex items-center">
                      <Layout className="mr-2 h-4 w-4" />
                      Carousel
                    </div>
                  </SelectItem>
                  <SelectItem value="interactiveGrid">
                    <div className="flex items-center">
                      <Grid className="mr-2 h-4 w-4" />
                      Interactive Grid
                    </div>
                  </SelectItem>
                  <SelectItem value="timeline">
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4" />
                      Timeline
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
            {userRoute && canEdit && (
              <AddProjectDialogComponent userRoute={userRoute} />
            )}
          </div>
        </div>
        <div ref={animationParent}>
          {projects.length > 0 ? (
            renderProjects()
          ) : (
            <p className="text-center text-muted-foreground">
              No projects added yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
