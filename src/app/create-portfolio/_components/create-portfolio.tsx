"use client";

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

import {
  addAboutMe,
  addRoute,
  checkRouteAvailability,
} from "@/actions/create-portfolio-actions";
import { User } from "lucia";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

const RouteFormSchema = z.object({
  routeName: z
    .string()
    .min(3, { message: "Route name must be at least 3 characters." })
    .max(30, { message: "Route name must not exceed 30 characters." })
    .regex(/^[a-zA-Z][a-zA-Z0-9-]*$/, {
      message:
        "Route name must start with a letter and can only contain letters, numbers, and hyphens.",
    })
    .refine((value) => !value.includes(" "), {
      message: "Route name cannot contain spaces.",
    })
    .refine((value) => /^[a-z0-9-]+$/.test(value), {
      message:
        "Route name can only contain lowercase letters, numbers, and hyphens.",
    }),
});

const FormSchema = z.object({
  fullName: z.string().min(2, { message: "Full name is required." }),
  title: z.string().min(2, { message: "Title is required." }),
  tagline: z.string().min(5, { message: "Tagline is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." })
    .max(300, { message: "Description must not exceed 250 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  skills: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })
    .optional(),
  linkedin: z.string().url({ message: "Invalid LinkedIn URL." }).optional(),
  github: z.string().url({ message: "Invalid GitHub URL." }).optional(),
});

export function CreatePortfolio({ user }: { user: User | undefined }) {
  const [isRouteAssigned, setIsRouteAssigned] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingTagline, setIsGeneratingTagline] = useState(false);
  const [isGeneratingAltTagline, setIsGeneratingAltTagline] = useState(false);

  const routeForm = useForm<z.infer<typeof RouteFormSchema>>({
    resolver: zodResolver(RouteFormSchema),
    defaultValues: {
      routeName: "",
    },
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      description: "",
      email: "",
    },
  });

  const handleRouteAvailability = async (
    data: z.infer<typeof RouteFormSchema>,
  ) => {
    setIsChecking(true);

    try {
      const isAvailable = await checkRouteAvailability(data.routeName);

      if (!isAvailable) {
        toast({
          title: "Route is not available",
          description: "Please try a different route name.",
          variant: "destructive",
        });
      } else {
        setIsRouteAssigned(true);
      }
    } catch (error) {
      console.error("Error checking route availability:", error);
      toast({
        title: "Error",
        description: "Failed to check route availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    const fullName = form.getValues("fullName");
    const title = form.getValues("title");
    const tagline = form.getValues("tagline");
    const currentDescription = form.getValues("description");

    let prompt =
      "Generate a concise and to-the-point professional description for a portfolio, maximum 250 characters";

    if (fullName || title || tagline) {
      prompt += ` for ${fullName || "a person"}, who is a ${title || "professional"}`;
      if (tagline) prompt += `. Their tagline is: "${tagline}"`;
    }

    if (currentDescription) {
      prompt += `. Incorporate key points from the following: "${currentDescription}"`;
    }

    prompt += ". Ensure the response is no longer than 250 characters.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        const truncatedDescription = data.output.slice(0, 250);
        form.setValue("description", truncatedDescription);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate description. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateTagline = async (alternative = false) => {
    const setGenerating = alternative
      ? setIsGeneratingAltTagline
      : setIsGeneratingTagline;
    setGenerating(true);
    const fullName = form.getValues("fullName");
    const title = form.getValues("title");
    const currentTagline = form.getValues("tagline");

    let prompt = alternative
      ? "Create a simple, clear tagline under 30 characters for any tech role."
      : "Create a straightforward tagline under 30 characters for any tech field.";

    if (fullName || title) {
      prompt += ` for ${fullName || "a person"}, who is a ${title || "professional"}`;
    }

    if (currentTagline && !alternative) {
      prompt += `. Consider this existing tagline: "${currentTagline}"`;
    }

    prompt += ". Ensure the response is no longer than 50 characters.";

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: prompt }),
      });

      const data = await response.json();

      if (response.ok) {
        const truncatedTagline = data.output.slice(0, 50);
        form.setValue("tagline", truncatedTagline);
      } else {
        toast({
          title: "Error",
          description: "Failed to generate tagline. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGenerating(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted", data);

    try {
      const routeName = routeForm.getValues("routeName");
      const [{ id: routeId }] = await addRoute(routeName);

      const portfolioData = {
        ...data,
        userId: user?.id,
      };

      // Here you would typically have an API call to create the portfolio

      const aboutMeData = {
        ...data,
        skills: data.skills || null,
        github: data.github || null,
        phoneNumber: data.phone || null,
        linkedIn: data.linkedin || null,
        userId: user?.id || 0,
        routeId: routeId,
      };

      await addAboutMe(aboutMeData);
      console.log("Portfolio data prepared:", portfolioData);

      toast({
        title: "Portfolio created!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(portfolioData, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  console.log("Rendering component, isRouteAssigned:", isRouteAssigned);

  return (
    <div className="flex flex-grow flex-col">
      {!isRouteAssigned ? (
        <div className="flex flex-grow flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg">
            <Form {...routeForm}>
              <form
                onSubmit={routeForm.handleSubmit(handleRouteAvailability)}
                className="space-y-4"
              >
                <div>user id: {user?.id}</div>
                <FormField
                  control={routeForm.control}
                  name="routeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Route Name</FormLabel>
                      <div className="flex w-full flex-col gap-2 sm:flex-row">
                        <FormControl>
                          <Input
                            placeholder="your-unique-route"
                            className="w-full"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="submit"
                          className="whitespace-nowrap"
                          disabled={isChecking}
                        >
                          {isChecking ? "Checking..." : "Check Availability"}
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
        </div>
      ) : (
        <div className="flex flex-grow flex-col items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <h1 className="mb-6 text-2xl font-bold">Create Portfolio</h1>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                {/* Form fields */}
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Frontend Developer" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tagline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tagline (max 50 characters)</FormLabel>
                      <FormControl>
                        <div className="space-y-2">
                          <Input
                            placeholder="Your catchy tagline"
                            {...field}
                            maxLength={50}
                            onChange={(e) => {
                              const value = e.target.value.slice(0, 50);
                              field.onChange(value);
                            }}
                          />
                          <div className="flex items-center justify-between space-x-2">
                            <Button
                              type="button"
                              onClick={() => generateTagline()}
                              disabled={
                                isGeneratingTagline || isGeneratingAltTagline
                              }
                            >
                              {isGeneratingTagline ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Generate Tagline"
                              )}
                            </Button>
                            <Button
                              type="button"
                              onClick={() => generateTagline(true)}
                              disabled={
                                isGeneratingTagline || isGeneratingAltTagline
                              }
                            >
                              {isGeneratingAltTagline ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Generating...
                                </>
                              ) : (
                                "Alternative Tagline"
                              )}
                            </Button>
                            <span className="text-sm text-gray-500">
                              {field?.value?.length}/50
                            </span>
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div>
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (max 250 characters)</FormLabel>
                        <FormControl>
                          <div className="space-y-2">
                            <Textarea
                              placeholder="A brief description of yourself"
                              {...field}
                              maxLength={250}
                              onChange={(e) => {
                                const value = e.target.value.slice(0, 250);
                                field.onChange(value);
                              }}
                            />
                            <div className="flex items-center justify-between">
                              <Button
                                type="button"
                                onClick={generateDescription}
                                disabled={isGeneratingDescription}
                              >
                                {isGeneratingDescription ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  "Generate With AI"
                                )}
                              </Button>
                              <span className="text-sm text-gray-500">
                                {field.value.length}/250
                              </span>
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="JavaScript, React, Node.js"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (optional)</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1234567890"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://www.linkedin.com/in/johndoe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="github"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub URL (optional)</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://github.com/johndoe"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full">
                  Create Portfolio
                </Button>
              </form>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
}
