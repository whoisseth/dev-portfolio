"use client";

import { FormSchema as HeroFormSchema } from "@/app/create-portfolio/_components/create-portfolio";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useCallback, useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { User } from "lucia";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { updateHeroSection } from "@/actions/create-portfolio-actions";
import { HeroSection } from "@/db/schema";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

type Props = {
  user: User | undefined;
  routeId: number;
  heroSection: HeroSection;
  className?: string;
};

export default function EditHeroSectionDialog({
  user,
  routeId,
  heroSection,
  className,
}: Props) {
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [isGeneratingTagline, setIsGeneratingTagline] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<z.infer<typeof HeroFormSchema>>({
    resolver: zodResolver(HeroFormSchema),
    defaultValues: {
      fullName: heroSection.fullName ?? "",
      title: heroSection.title ?? "",
      tagline: heroSection.tagline ?? "",
      description: heroSection.description,
      email: heroSection.email,
      skills: heroSection.skills ?? [],
      linkedin: heroSection.linkedIn ?? "",
      github: heroSection.github ?? "",
      youtube: heroSection.youtube ?? "",
      phoneNumber: heroSection.phoneNumber ?? "",
    },
  });

  const { isDirty: isFormDirty } = form.formState;

  const generateDescription = async () => {
    setIsGeneratingDescription(true);
    const fullName = form.getValues("fullName");
    const title = form.getValues("title");
    const tagline = form.getValues("tagline");
    const currentDescription = form.getValues("description");

    let prompt =
      "Generate a professional first-person description for a portfolio, in a single paragraph, strictly under 200 characters, without special characters. Use 'I am' statements and make it personal and concise.";

    if (fullName || title || tagline) {
      prompt += ` The description should be for me, ${fullName || "the portfolio owner"}. I am a ${title || "professional"}`;
      if (tagline) prompt += ` and my tagline is '${tagline}'`;
    }

    if (currentDescription) {
      prompt += `. Consider this existing description: ${currentDescription}`;
    }

    prompt +=
      " Ensure the response uses 'I am' statements, is 200 characters or fewer, has no special characters, and is a single paragraph. Be concise and focus on key professional attributes.";

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
        toast.error("Failed to generate description. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const generateTagline = async (alternative = false) => {
    setIsGeneratingTagline(true);
    const fullName = form.getValues("fullName");
    const title = form.getValues("title");
    const currentTagline = form.getValues("tagline");

    let prompt = alternative
      ? "Create a simple clear tagline under 30 characters for any tech role without special characters, double quotes, or colons."
      : "Create a straightforward tagline under 30 characters for any tech field without special characters, double quotes, or colons.";

    if (fullName || title) {
      prompt += ` for ${fullName || "a person"} who is a ${title || "professional"}`;
    }

    if (currentTagline && !alternative) {
      prompt += ` Consider this existing tagline ${currentTagline}`;
    }

    prompt +=
      " Ensure the response is no longer than 50 characters and does not contain special characters, double quotes, or colons.";

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
        toast.error("Failed to generate tagline. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setIsGeneratingTagline(false);
    }
  };

  const skillInputRef = useRef<HTMLInputElement>(null);

  const addSkill = (skills: string[], onChange: (value: string[]) => void) => {
    const newSkill = skillInputRef.current?.value.trim();
    if (newSkill && !skills.includes(newSkill) && skills.length < 20) {
      onChange([...skills, newSkill]);
      if (skillInputRef.current) {
        skillInputRef.current.value = "";
      }
    }
  };

  const onSubmit = async (data: z.infer<typeof HeroFormSchema>) => {
    startTransition(async () => {
      try {
        console.log("Form submitted with data:", data);
        console.log("inside startTransition");
        await updateHeroSection({
          ...data,
          linkedIn: data.linkedin || "",
          userId: user?.id || 0,
          routeId: routeId || 0,
          id: heroSection.id,
        });
        toast.success("Your information has been updated successfully.");
        console.log("inside startTransition - Form updated");
        console.log("after startTransition");
        setIsDialogOpen(false);
        form.reset(data);
      } catch (error) {
        console.error("Error updating about me:", error);
        toast.error("Failed to update your information. Please try again.");
      }
    });
  };

  const resetForm = useCallback(() => {
    form.reset({
      fullName: heroSection.fullName ?? "",
      title: heroSection.title ?? "",
      tagline: heroSection.tagline ?? "",
      description: heroSection.description ?? "",
      email: heroSection.email ?? "",
      skills: heroSection.skills ?? [],
      linkedin: heroSection.linkedIn ?? "",
      github: heroSection.github ?? "",
      youtube: heroSection.youtube ?? "",
      phoneNumber: heroSection.phoneNumber ?? "",
    });
  }, [heroSection, form]);

  const handleOpenChange = (newOpen: boolean) => {};

  const handleDialogClose = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      resetForm();
    }
    setIsDialogOpen(isOpen);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={cn(className)}>
          Edit Hero Section
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-4xl p-0 sm:max-h-[95vh]">
        <ScrollArea className="h-full max-h-[90vh] w-full">
          <div className="flex h-full flex-col md:flex-row">
            <div className="flex-1 overflow-y-auto p-6">
              <h1 className="mb-6 text-2xl font-bold">Update Hero Section</h1>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
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
                            <Input
                              placeholder="Frontend Developer"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Tagline (max 50 characters) (optional)
                        </FormLabel>
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
                                size="sm"
                                onClick={() => generateTagline()}
                                disabled={isGeneratingTagline}
                              >
                                {isGeneratingTagline ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Generating...
                                  </>
                                ) : (
                                  "Generate With AI"
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
                                size="sm"
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

                  <div className="grid gap-4 sm:grid-cols-2">
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
                      name="phoneNumber"
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
                  </div>

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills</FormLabel>
                        <FormControl>
                          <div>
                            <div className="flex">
                              <Input
                                ref={skillInputRef}
                                placeholder="Add a new skill"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    e.preventDefault();
                                    addSkill(
                                      Array.isArray(field.value)
                                        ? field.value
                                        : [],
                                      field.onChange,
                                    );
                                  }
                                }}
                                className="flex-grow"
                                disabled={
                                  Array.isArray(field.value) &&
                                  field.value.length >= 20
                                }
                              />
                              <Button
                                type="button"
                                onClick={() =>
                                  addSkill(
                                    Array.isArray(field.value)
                                      ? field.value
                                      : [],
                                    field.onChange,
                                  )
                                }
                                className="ml-2"
                                disabled={
                                  Array.isArray(field.value) &&
                                  field.value.length >= 20
                                }
                              >
                                Add Skill
                              </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {Array.isArray(field.value) &&
                                field.value.map((skill, index) => (
                                  <Badge
                                    key={index}
                                    variant="secondary"
                                    className="text-sm"
                                  >
                                    {skill}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const newSkills = Array.isArray(
                                          field.value,
                                        )
                                          ? [...field.value]
                                          : [];
                                        newSkills.splice(index, 1);
                                        field.onChange(newSkills);
                                      }}
                                      className="ml-1 hover:text-destructive focus:outline-none"
                                    >
                                      <X size={14} />
                                    </button>
                                  </Badge>
                                ))}
                            </div>
                            <div className="mt-2 text-xs text-muted-foreground">
                              {Array.isArray(field.value)
                                ? field.value.length
                                : 0}
                              /20
                            </div>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 sm:grid-cols-2">
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
                  </div>

                  <FormField
                    control={form.control}
                    name="youtube"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>YouTube URL (optional)</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://www.youtube.com/c/yourchannel"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isPending || !isFormDirty}
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Update Hero Section"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
