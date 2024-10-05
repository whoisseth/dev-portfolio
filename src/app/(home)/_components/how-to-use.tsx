import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HowToUse() {
  const steps = [
    {
      title: "Create an Account",
      description:
        "Sign up for a free Portly account to get started. It only takes a minute and you'll have access to all our features.",
      media: "video",
    },
    {
      title: "Create a Portfolio",
      description:
        "Fill in the necessary details required for the hero section, including your name, title, and a brief introduction. Make sure to highlight your key skills and achievements.",
      media: "image",
    },
    // ... existing code ...
    {
      title: "Add Your Projects",
      description:
        "Showcase your best work by adding projects to your portfolio. Include descriptions, images, and links to demonstrate your skills.",
      media: "video",
    },
    {
      title: "Add Your Work Experience",
      description:
        "Highlight your professional journey by adding your work experience. Include your roles, responsibilities, and achievements.",
      media: "video",
    },
    {
      title: "Share Your Portfolio",
      description:
        "Once you're happy with your portfolio, share it with the world. Use your custom URL or embed it on your website.",
      media: "video",
    },
  ];

  return (
    <section className="bg-background px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-12 text-center text-3xl font-bold">
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
                      <img
                        src="/images/placeholder.svg"
                        alt={`Step ${index + 1}: ${step.title}`}
                        // layout="fill"
                        // objectFit="cover"
                        className="bg-muted-foreground/20 dark:brightness-[0.2] dark:grayscale"
                      />
                      {/* Replace with actual video component when available */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-muted-foreground">
                          Video Placeholder
                        </span>
                      </div>
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
      </div>
    </section>
  );
}
