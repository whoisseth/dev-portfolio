"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Phone,
  Youtube,
} from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/db/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormSchema } from "@/app/create-portfolio/_components/create-portfolio";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useState, useTransition, useRef } from "react";
import { Input } from "@/components/ui/input";
import { updateHeroSection } from "@/actions/create-portfolio-actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucia";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import { FilePen } from "lucide-react";
import AvatarEditor, {
  AvatarFeature,
  AvatarOptions,
} from "./_components/avatar-editor";
import { createAvatar, Options } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

type HeroProps = {
  routeName: string;
  heroSection: HeroSection;
  user: User | undefined;
  isProjectsEmpty?: boolean;
};

export function Hero({
  heroSection,
  user,
  routeName,
  isProjectsEmpty,
}: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [isPending, startTransition] = useTransition();
  const canEdit = useCanEditPortfolio(user);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(
    heroSection.avatarOptions as AvatarOptions,
  );

  // console.log("About me id:", heroSection.id);

  const avatar = createAvatar(
    notionists,
    avatarOptions as Partial<Options & Options>,
  );
  const svg = avatar.toString();
  // console.log("SVG0-", svg); // Add this line to check the SVG content

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
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
  const { isDirty } = form.formState; // Add this line

  // console.log("Form data:", form.getValues());
  // console.log("Phone number:", form.getValues("phoneNumber"));

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      try {
        console.log("Form submitted with data:", data);
        console.log("inside startTransition");
        await updateHeroSection({
          ...data,
          linkedIn: data.linkedin || "",
          userId: heroSection.userId,
          routeId: heroSection.routeId,
          id: heroSection.id,
        });
        toast.success("Your information has been updated successfully.");
        setIsEditing(false);
        console.log("inside startTransition - Form updated");
        console.log("after startTransition");
      } catch (error) {
        console.error("Error updating about me:", error);
        toast.error("Failed to update your information. Please try again.");
      }
    });
  };

  const skillInputRef = useRef<HTMLInputElement>(null);

  const addSkill = (skills: string[], onChange: (value: string[]) => void) => {
    const newSkill = skillInputRef.current?.value.trim();
    if (newSkill && !skills.includes(newSkill)) {
      onChange([...skills, newSkill]);
      if (skillInputRef.current) {
        skillInputRef.current.value = "";
      }
    }
  };

  return (
    <div id="about-me">
      <div className="flex flex-col-reverse items-center gap-12 py-6 sm:py-10 lg:flex-row">
        {/* left side user info */}
        <div className="flex-1">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 lg:text-left"
            >
              <div className="flex-1">
                {/* full name */}
                <div>
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="border-none bg-transparent text-4xl font-bold leading-tight md:text-5xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                      {heroSection.fullName}
                    </h1>
                  )}

                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="Software Engineer"
                              className="border-none bg-transparent text-xl sm:text-3xl md:text-2xl"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    <p className="text-xl sm:text-3xl md:text-2xl">
                      {heroSection.title && `{ ${heroSection.title} }`}
                    </p>
                  )}
                </div>
                {/* tagline */}
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="tagline"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Innovative solutions to complex problems"
                            className="mt-4 border-none bg-transparent text-3xl font-bold leading-tight sm:text-4xl md:text-4xl"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-4xl">
                    {heroSection.tagline}
                  </h2>
                )}

                {/* description */}
                {isEditing ? (
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="I am a software engineer with a passion for building innovative solutions to complex problems."
                            className="mt-4 max-w-3xl border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
                    {heroSection.description}
                  </p>
                )}
                {/* extra details  */}
                {/* add input for email    */}

                <div className="mt-4 space-y-3">
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="john.doe@example.com"
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.email && (
                      <div className="flex items-center space-x-2">
                        <Mail className="h-4 w-4" />
                        <span className="text-sm">{heroSection.email}</span>
                      </div>
                    )
                  )}

                  {/* add input for skills  */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="skills"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div>
                              <div className="flex">
                                <Input
                                  disabled={
                                    Array.isArray(field.value) &&
                                    field.value.length >= 20
                                  }
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
                                />
                                <Button
                                  type="button"
                                  disabled={
                                    Array.isArray(field.value) &&
                                    field.value.length >= 20
                                  }
                                  onClick={() =>
                                    addSkill(
                                      Array.isArray(field.value)
                                        ? field.value
                                        : [],
                                      field.onChange,
                                    )
                                  }
                                  className="ml-2"
                                >
                                  Add Skill
                                </Button>
                              </div>

                              <div className="mt-2 flex flex-wrap gap-1">
                                {field.value &&
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
                                          const newSkills = [
                                            ...(field.value || []),
                                          ] as string[];
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
                  ) : (
                    heroSection.skills && (
                      <div className="flex items-center space-x-2">
                        <div className="size-4">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {heroSection.skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="text-sm"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )
                  )}

                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="phoneNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="+913456789090"
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.phoneNumber && (
                      <div className="flex items-center space-x-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">
                          {heroSection.phoneNumber}
                        </span>
                      </div>
                    )
                  )}

                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="https://www.linkedin.com/in/john-doe"
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.linkedIn && (
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Linkedin className="h-4 w-4" />
                        <Link
                          target="_blank"
                          href={heroSection.linkedIn || ""}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          {heroSection.linkedIn?.replace("https://", "")}
                        </Link>
                      </div>
                    )
                  )}
                  {/* github */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="github"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="https://www.github.com/john-doe"
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.github && (
                      <div className="flex items-center space-x-2 text-blue-400">
                        <Github className="h-4 w-4" />
                        <Link
                          target="_blank"
                          href={heroSection.github || ""}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          {heroSection.github?.replace("https://", "")}
                        </Link>
                      </div>
                    )
                  )}
                  {/* youtube */}
                  {isEditing ? (
                    <FormField
                      control={form.control}
                      name="youtube"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              placeholder="https://www.youtube.com/c/yourchannel"
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.youtube && (
                      <div className="flex items-center gap-2 text-blue-400">
                        <Youtube className="h-4 w-4" />
                        <Link
                          target="_blank"
                          href={heroSection.youtube || ""}
                          className="text-sm text-blue-400 hover:underline"
                        >
                          {heroSection.youtube?.replace("https://", "")}
                        </Link>
                      </div>
                    )
                  )}
                </div>
                {/*  */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-start">
                  {/* <Link href="#projects" className="w-full"> */}

                  {/* #projects */}
                  {!isProjectsEmpty && (
                    <Link
                      href="#projects"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "w-full sm:max-w-[265px]",
                      )}
                    >
                      View Projects
                    </Link>
                  )}
                  {/* </Link> */}
                  {/* <Button type="button" size="default" variant="outline">
                    View Resume
                  </Button> */}
                </div>
              </div>
              {/* edit button */}
              <div className="mt-8 flex flex-col gap-4 sm:max-w-[265px] sm:flex-row lg:justify-start">
                {isEditing && (
                  <>
                    <Button
                      className="w-full"
                      variant={"outline"}
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      disabled={isPending || !isDirty}
                      className="w-full"
                      type="submit"
                    >
                      {isPending ? "Saving..." : "Save"}
                    </Button>
                  </>
                )}

                {!isEditing && canEdit && user && (
                  <Button
                    className="w-full"
                    variant={"outline"}
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    <FilePen size={16} className="mr-2" /> Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
        {/* right side avatar */}
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 lg:max-w-none">
          {canEdit && user && (
            <AvatarEditor
              avatarOptions={avatarOptions}
              setAvatarOptions={setAvatarOptions}
              user={user}
              className="absolute right-0 top-5"
            />
          )}

          <div className="bg-mute flex h-auto w-full max-w-[500px] flex-1 items-center justify-center rounded-full bg-muted">
            <div
              //
              className="h-full w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
