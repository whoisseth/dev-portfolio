"use client";

import { Card, CardContent } from "@/components/ui/card";
import { User, WorkExperience } from "@/db/schema";
import { UpdateWorkExperienceDialogComponent } from "./_components/update-work-experience-dialog";
import { User as UserType } from "lucia";
import { DeleteWorkExperienceDialog } from "./_components/delete-work-experience-dialog";
import { AddWorkExperienceDialogComponent } from "./_components/add-work-experience-dialog";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";

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

export function WorkExperienceSection({
  userRoute,
  workExperiences,
  user,
}: WorkExperienceSectionProps) {
  //   const [workExperiences, setWorkExperiences] = useState(dataWorkExperiences);
  const canEdit = useCanEditPortfolio(user);

  return (
    <div id="work-experience" className="mx-auto ">
      {(workExperiences.length > 0 || canEdit) && (
        <section className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Work Experience</h2>

          {userRoute && canEdit && (
            <AddWorkExperienceDialogComponent userRoute={userRoute} />
          )}
        </section>
      )}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
                  <p className="text-sm text-muted-foreground">
                    {experience.companyName}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{experience.location}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(experience.startDate).toLocaleDateString(
                      "en-US",
                      { month: "short", year: "numeric" },
                    )}{" "}
                    -{" "}
                    {experience.isPresent
                      ? "Present"
                      : new Date(experience?.endDate ?? "").toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm">{experience.jobDescription}</p>
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
    </div>
  );
}
