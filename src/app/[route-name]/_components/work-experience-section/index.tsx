"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { User, WorkExperience } from "@/db/schema";
import { UpdateWorkExperienceDialogComponent } from "./_components/update-work-experience-dialog";
import { User as UserType } from "@/lib/session";
import { DeleteWorkExperienceDialog } from "./_components/delete-work-experience-dialog";
import { AddWorkExperienceDialogComponent } from "./_components/add-work-experience-dialog";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Layout, Grid, List } from "lucide-react";
import { updateWorkExperienceLayoutStyle } from "@/actions/create-portfolio-actions";

type WorkExperienceSectionProps = {
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
  workExperiences: WorkExperience[];
  user: UserType | undefined;
};

export type LayoutStyle = "cards" | "list" | "grid";

export function WorkExperienceSection({
  userRoute,
  workExperiences,
  user,
}: WorkExperienceSectionProps) {
  const canEdit = useCanEditPortfolio(user);
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>(
    workExperiences[0]?.layoutStyle || "cards",
  );

  console.log("workExperiences", workExperiences);

  // updateWorkExperienceLayoutStyle
  async function handleLayoutStyleChange(layoutStyle: LayoutStyle) {
    setLayoutStyle(layoutStyle);
    await updateWorkExperienceLayoutStyle(
      workExperiences[0]?.id || 0,
      layoutStyle,
    );
  }

  const renderWorkExperience = () => {
    switch (layoutStyle) {
      case "cards":
      case "grid":
        return (
          <div
            className={`grid gap-4 ${layoutStyle === "grid" ? "md:grid-cols-3" : "md:grid-cols-2"}`}
          >
            {workExperiences.map((experience) => (
              <Card
                key={experience.id}
                className="overflow-hidden border-l-4 border-l-primary"
              >
                <CardContent className="p-4">
                  <div className="mb-2 flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {experience.jobTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground/70">
                        {experience.companyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {experience.location}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {new Date(experience.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )}{" "}
                        -{" "}
                        {experience.isPresent
                          ? "Present"
                          : new Date(
                              experience?.endDate ?? "",
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {experience.jobDescription}
                  </p>
                  {userRoute && canEdit && (
                    <div className="mt-4 flex gap-2">
                      <UpdateWorkExperienceDialogComponent
                        userRoute={userRoute}
                        workExperience={experience}
                      />
                      <DeleteWorkExperienceDialog workExperience={experience} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );
      case "list":
        return (
          <div className="space-y-4">
            {workExperiences.map((experience) => (
              <Card key={experience.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {experience.jobTitle}
                      </h3>
                      <p className="text-sm text-muted-foreground/70">
                        {experience.companyName}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {experience.location}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {new Date(experience.startDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )}{" "}
                        -{" "}
                        {experience.isPresent
                          ? "Present"
                          : new Date(
                              experience?.endDate ?? "",
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              year: "numeric",
                            })}
                      </p>
                    </div>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {experience.jobDescription}
                  </p>
                  {userRoute && canEdit && (
                    <div className="mt-4 flex gap-2">
                      <UpdateWorkExperienceDialogComponent
                        userRoute={userRoute}
                        workExperience={experience}
                      />
                      <DeleteWorkExperienceDialog workExperience={experience} />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="py-4">
      <section id="work-experience" className="container mx-auto px-4 sm:px-8">
        {(workExperiences.length > 0 || canEdit) && (
          <section className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold">Work Experience</h2>
            <div className="flex items-center space-x-2">
              {canEdit && (
                <Select
                  value={layoutStyle}
                  onValueChange={handleLayoutStyleChange}
                >
                  <SelectTrigger className="hidden w-[180px] md:flex">
                    <SelectValue placeholder="Select a layout" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cards">
                      <div className="flex items-center">
                        <Layout className="mr-2 h-4 w-4" />
                        Cards
                      </div>
                    </SelectItem>
                    <SelectItem value="list">
                      <div className="flex items-center">
                        <List className="mr-2 h-4 w-4" />
                        List
                      </div>
                    </SelectItem>
                    <SelectItem value="grid">
                      <div className="flex items-center">
                        <Grid className="mr-2 h-4 w-4" />
                        Grid
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
              {userRoute && canEdit && (
                <AddWorkExperienceDialogComponent userRoute={userRoute} />
              )}
            </div>
          </section>
        )}
        {renderWorkExperience()}
      </section>
    </div>
  );
}
