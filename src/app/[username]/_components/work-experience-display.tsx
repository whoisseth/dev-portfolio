"use client";

import { Card, CardContent } from "@/components/ui/card";

interface WorkExperience {
  id: string;
  jobTitle: string;
  companyName: string;
  location: string;
  startDate: string;
  endDate: string;
  isPresent: boolean;
  jobDescription: string;
}

const sampleExperiences: WorkExperience[] = [
  {
    id: "1",
    jobTitle: "Senior Software Engineer",
    companyName: "Tech Innovations Inc.",
    location: "San Francisco, CA",
    startDate: "2020-03",
    endDate: "",
    isPresent: true,
    jobDescription:
      "Led a team of developers in creating scalable web applications. Implemented microservices architecture and improved system performance by 40%.",
  },
  {
    id: "2",
    jobTitle: "Full Stack Developer",
    companyName: "Digital Solutions Ltd.",
    location: "New York, NY",
    startDate: "2017-06",
    endDate: "2020-02",
    isPresent: false,
    jobDescription:
      "Developed and maintained multiple client-facing web applications. Collaborated with UX designers to implement responsive designs and improve user engagement.",
  },
  {
    id: "3",
    jobTitle: "Frontend Developer",
    companyName: "WebCraft Co.",
    location: "Austin, TX",
    startDate: "2015-09",
    endDate: "2017-05",
    isPresent: false,
    jobDescription:
      "Specialized in creating responsive and accessible user interfaces. Implemented state management solutions and optimized application performance.",
  },
  {
    id: "4",
    jobTitle: "Junior Web Developer",
    companyName: "StartUp Dynamics",
    location: "Seattle, WA",
    startDate: "2014-01",
    endDate: "2015-08",
    isPresent: false,
    jobDescription:
      "Assisted in the development of company websites and internal tools. Gained experience in agile methodologies and version control systems.",
  },
];

export function WorkExperienceDisplay() {
  return (
    // <div id="work-experience" className="mx-auto max-w-2xl">
    <div id="work-experience" className="mx-auto ">
      <h2 className="mb-4  text-2xl font-bold">Work Experience</h2>
      <div className="space-y-3">
        {sampleExperiences.map((experience) => (
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
                      : new Date(experience.endDate).toLocaleDateString(
                          "en-US",
                          { month: "short", year: "numeric" },
                        )}
                  </p>
                </div>
              </div>
              <p className="mt-2 text-sm">{experience.jobDescription}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
