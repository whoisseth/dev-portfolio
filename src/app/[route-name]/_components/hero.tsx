"use client";

import { Button } from "@/components/ui/button";
import LaptopSvg from "./svg/laptop";
import { Briefcase, Github, Linkedin, Mail, Phone } from "lucide-react";
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
import { useState, useTransition } from "react";
import { Input } from "@/components/ui/input";
import { updateHeroSection } from "@/actions/create-portfolio-actions";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucia";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";

type HeroProps = {
  heroSection: HeroSection;
  user: User | undefined;
};

export function Hero({ heroSection, user }: HeroProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const canEdit = useCanEditPortfolio(user);

  console.log("About me id:", heroSection.id);

  // const avatarName = aboutMe.fullName.split(" ").join("");
  const avatarName = "Oreo";
  const avatarFlip = "true";
  const avatarClip = "true"; // not wokring
  const avatarBeard = "variant01"; // not working
  // freckles=variant0
  // crete a variable for avatarfles
  const avatarFreckles = "variant01"; // not working

  const avatarGlasses = "variant04";
  // gender=female
  const avatarGender = "female";

  //

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: heroSection.fullName ?? "",
      title: heroSection.title ?? "",
      tagline: heroSection.tagline ?? "",
      description: heroSection.description,
      email: heroSection.email,
      skills: heroSection.skills ?? undefined,
      linkedin: heroSection.linkedIn ?? undefined,
      github: heroSection.github ?? undefined,
      phoneNumber: heroSection.phoneNumber ?? undefined,
    },
  });

  // console.log("Form data:", form.getValues());
  console.log("Phone number:", form.getValues("phoneNumber"));

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      console.log("Form submitted with data:", data);
      startTransition(async () => {
        await updateHeroSection({
          ...data,
          userId: heroSection.userId,
          routeId: heroSection.routeId,
          id: heroSection.id,
        });
        toast.success("Your information has been updated successfully.");
        setIsEditing(false);
      });
    } catch (error) {
      console.error("Error updating about me:", error);
      toast.error("Failed to update your information. Please try again.");
    }
  };
  return (
    <div id="about-me">
      <div className="flex flex-col-reverse items-center gap-12 py-6 lg:flex-row">
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
                            <Input
                              placeholder="JavaScript, React, Node.js, etc."
                              className="mt-4 border-none bg-transparent text-sm text-muted-foreground sm:text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ) : (
                    heroSection.skills && (
                      <div className="flex items-center space-x-2">
                        <Briefcase className="h-4 w-4" />
                        <span className="text-sm">
                          {Array.isArray(heroSection.skills)
                            ? heroSection.skills.join(", ")
                            : heroSection.skills}
                        </span>
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
                      <div className="flex items-center space-x-2">
                        <Linkedin className="h-4 w-4" />
                        <Link
                          target="_blank"
                          href={heroSection.linkedIn || ""}
                          className="text-sm hover:underline"
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
                      <div className="flex items-center space-x-2">
                        <Github className="h-4 w-4" />
                        <Link
                          target="_blank"
                          href={heroSection.github || ""}
                          className="hover:underline"
                        >
                          {heroSection.github?.replace("https://", "")}
                        </Link>
                      </div>
                    )
                  )}
                </div>
                {/*  */}
                <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-start">
                  {/* <Link href="#projects" className="w-full"> */}
                  <Button type="button" size="default">
                    View Projects
                  </Button>
                  {/* </Link> */}
                  <Button type="button" size="default" variant="outline">
                    View Resume
                  </Button>
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
                      disabled={isPending}
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
                    variant={"secondary"}
                    type="button"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
        {/* right side avatar */}
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 lg:max-w-none  ">
           {/* <LaptopSvg className="h-auto w-full" /> */}
          {/* Oreo is the avatar name */}
          <img
            // className="rounded-full border-2 bg-secondary   border-primary"
            // dark:bg-[]
            // className="rounded-full  !fill-black !dark:fill-white  dark:invert   border-primary"
            className="!dark:fill-white rounded-full !fill-black dark:invert"
            // add freckles
            // add glasses

            src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarName}&flip=${avatarFlip}&avatarClip=${avatarClip}&beard=${avatarBeard}&freckles=${avatarFreckles}&glasses=${avatarGlasses}&gender=${avatarGender}&mouth=happy01,happy02,happy03,happy04,happy05,happy06,happy07,happy08,happy09,happy10,happy11,happy12,happy13,happy14,happy16`}
            // src={`https://api.dicebear.com/9.x/lorelei/svg?seed=${avatarName}&flip=${avatarFlip}&avatarClip=${avatarClip}&beard=${avatarBeard}&freckles=${avatarFreckles}&glasses=${avatarGlasses}&gender=${avatarGender}&hairAccessoriesProbability=10&mouth=happy01,happy02,happy03,happy04,happy05,happy06,happy07,happy08,happy09,happy10,happy11,happy12,happy13,happy14,happy16`}
            alt="avatar"
          />
        </div>
      </div>
    </div>
  );
}
