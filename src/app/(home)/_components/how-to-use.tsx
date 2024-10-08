import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HowToUse() {
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up for a free Portly account to get started. It only takes a minute and you'll have access to all our features.",
      media: "video",
      video: "/videos/Sign-in.mp4",
    },
    {
      title: "Create a Custom Route",
      description:
        "Create a custom route for your portfolio. This is the URL that will be used to access your portfolio.",
      media: "video",
      video: "/videos/Route-name.mp4",
    },
    // ... existing code ...
    {
      title: "Add Your Hero Section Details ",
      description:
        "Fill in the necessary details required for the hero section, including your name, title, and a brief introduction. Make sure to highlight your key skills and achievements.",
      media: "video",
      video: "/videos/Hero-Section.mp4",
    },
    {
      title: "Add Your Projects",
      description:
        "Showcase your best work by adding projects to your portfolio. Include descriptions, images, and links to demonstrate your skills.",
      media: "video",
      video: "/videos/Add-Project.mp4",
    },
    {
      title: "Add Your Work Experience",
      description:
        "Highlight your professional journey by adding your work experience. Include your roles, responsibilities, and achievements.",
      media: "video",
      video: "/videos/Add-Experience.mp4",
    },
  ];

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-4xl font-bold">
          How to Use Portly
        </h2>
        <div className="space-y-16">
          {steps.map((step, index) => (
            <Card key={index} className="overflow-hidden">
              <div
                className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"}`}
              >
                <div className="w-full bg-muted md:w-1/2">
                  {step.media === "video" ? (
                    <div className="relative aspect-video">
                      {/* video in loop disable controls diaabled picture in picture */}
                      <video
                        src={step.video}
                        autoPlay
                        loop
                        muted
                        playsInline
                        controls={false}
                        disablePictureInPicture
                        // alt={`Step ${index + 1}: ${step.title}`}
                        // layout="fill"
                        // objectFit="cover"
                        // className="bg-muted-foreground/20 dark:brightness-[0.2] dark:grayscale"
                      />
                      {/* Replace with actual video component when available */}
                      {/* <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground">
                          {step.title}
                        </span>
                      </div> */}
                    </div>
                  ) : (
                    <div className="relative aspect-square">
                      <img
                        src="/images/placeholder.svg"
                        alt={`Step ${index + 1}: ${step.title}`}
                        // layout="fill"
                        // objectFit="cover"
                        className="bg-muted-foreground/20 dark:brightness-[0.2] dark:grayscale"
                      />
                    </div>
                  )}
                </div>
                <CardContent className="flex w-full flex-col justify-center p-6 md:w-1/2 md:p-8">
                  <CardHeader className="mb-4 p-0">
                    <CardTitle className="mb-2 text-2xl font-bold">
                      {index + 1}. {step.title}
                    </CardTitle>
                  </CardHeader>
                  <p className="mb-6 text-muted-foreground">
                    {step.description}
                  </p>
                  {/* <Button className="self-start">Learn More</Button> */}
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex flex-col justify-center gap-2 md:flex-row pt-5">
          <Button  className="px-8 py-3 text-lg" asChild>
            <Link href="/create-portfolio">Create Your Portfolio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
