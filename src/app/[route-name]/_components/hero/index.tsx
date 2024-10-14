"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  Briefcase,
  Github,
  Linkedin,
  Mail,
  Phone,
  Youtube,
  Layout,
  Layers,
  Columns,
  Grid,
  Maximize,
  Monitor,
  Palette,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { HeroSection, workExperiences } from "@/db/schema";
import { User } from "@/lib/session";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import AvatarEditor, { AvatarOptions } from "./_components/avatar-editor";
import { createAvatar, Options } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import EditHeroSectionDialog from "./_components/edit-hero-section-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent } from "@/components/ui/card";
import { updateHeroSectionLayoutStyle } from "@/actions/create-portfolio-actions";

type HeroProps = {
  routeName: string;
  heroSection: HeroSection;
  user: User | undefined;
  isProjectsEmpty?: boolean;
};

export type HeroLayoutStyle =
  | "classic"
  | "spotlight"
  | "sidekick"
  | "minimalist"
  | "banner"
  | "modern"
  | "dynamic"
  | "elegant";

export function Hero({ heroSection, user, isProjectsEmpty }: HeroProps) {
  const canEdit = useCanEditPortfolio(user);
  const [avatarOptions, setAvatarOptions] = useState<AvatarOptions>(
    heroSection.avatarOptions as AvatarOptions,
  );
  const [layoutStyle, setLayoutStyle] = useState<HeroLayoutStyle>(
    heroSection.layoutStyle || "classic",
  );

  const avatar = createAvatar(
    notionists,
    avatarOptions as Partial<Options & Options>,
  );
  const svg = avatar.toString();

  async function handleLayoutStyleChange(layoutStyle: HeroLayoutStyle) {
    setLayoutStyle(layoutStyle);
    await updateHeroSectionLayoutStyle(heroSection.id || 0, layoutStyle);
  }

  const renderContent = () => {
    const userInfo = (
      <div className="flex-1 space-y-6">
        <div>
          <h1 className="text-4xl font-bold leading-tight md:text-5xl">
            {heroSection.fullName}
          </h1>
          <p className="text-xl text-primary sm:text-3xl md:text-2xl">
            {heroSection.title && `{ ${heroSection.title} }`}
          </p>
        </div>
        <h2 className="text-3xl font-bold leading-tight sm:text-4xl md:text-4xl">
          {heroSection.tagline}
        </h2>
        <p className="max-w-3xl text-sm text-muted-foreground sm:text-base">
          {heroSection.description}
        </p>
        <div className="space-y-3">
          {heroSection.email && (
            <Link
              href={`mailto:${heroSection.email}`}
              target="_blank"
              className="flex items-center space-x-2 text-blue-400 hover:underline"
            >
              <Mail className="h-4 w-4" />
              <span className="text-sm">{heroSection.email}</span>
            </Link>
          )}
          {heroSection.skills && (
            <div className="flex items-center space-x-2">
              <div className="size-4">
                <Briefcase className="h-4 w-4" />
              </div>
              <div className="flex flex-wrap gap-2">
                {heroSection.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {heroSection.phoneNumber && (
            <Link
              href={`tel:${heroSection.phoneNumber}`}
              className="flex items-center space-x-2 text-blue-400 hover:underline"
            >
              <Phone className="h-4 w-4" />
              <span className="text-sm">{heroSection.phoneNumber}</span>
            </Link>
          )}
          {heroSection.linkedIn && (
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
          )}
          {heroSection.github && (
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
          )}
          {heroSection.youtube && (
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
          )}
        </div>
        <div className="flex flex-col gap-4 sm:flex-row lg:justify-start">
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
        </div>
      </div>
    );

    const avatarSection = (
      <div className="relative flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 lg:max-w-none">
        <div className="bg-mute flex h-auto w-full max-w-[500px] flex-1 items-center justify-center rounded-full bg-muted">
          <div
            className="h-full w-full"
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        </div>
      </div>
    );

    const socialLinks = (
      <>
        {heroSection.github && (
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={heroSection.github}
                target="_blank"
                className="text-muted-foreground hover:text-primary"
              >
                <Github className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{heroSection.github}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {heroSection.linkedIn && (
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={heroSection.linkedIn}
                target="_blank"
                className="text-muted-foreground hover:text-primary"
              >
                <Linkedin className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{heroSection.linkedIn}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {heroSection.youtube && (
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={heroSection.youtube}
                target="_blank"
                className="text-muted-foreground hover:text-primary"
              >
                <Youtube className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{heroSection.youtube}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {heroSection.email && (
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={`mailto:${heroSection.email}`}
                target="_blank"
                className="text-muted-foreground hover:text-primary"
              >
                <Mail className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{heroSection.email}</p>
            </TooltipContent>
          </Tooltip>
        )}
        {heroSection.phoneNumber && (
          <Tooltip>
            <TooltipTrigger>
              <Link
                href={`tel:${heroSection.phoneNumber}`}
                className="text-muted-foreground hover:text-primary"
              >
                <Phone className="h-6 w-6" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{heroSection.phoneNumber}</p>
            </TooltipContent>
          </Tooltip>
        )}
      </>
    );

    switch (layoutStyle) {
      case "classic":
        return (
          <div className="container flex h-full flex-col-reverse items-center gap-12 px-4 py-6 sm:px-8 sm:py-10 lg:flex-row">
            {userInfo}
            {avatarSection}
          </div>
        );
      case "spotlight":
        return (
          <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
            <div className="bg-grid-white/10 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="container relative flex flex-col-reverse items-center gap-12 px-4 sm:px-8 lg:flex-row">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                {userInfo}
              </div>
              <div className="w-full max-w-md lg:w-1/2">{avatarSection}</div>
            </div>
          </div>
        );
      case "sidekick":
        return (
          <div className="container flex flex-col items-start gap-8 px-4 py-8 sm:px-8 md:flex-row">
            <div className="w-full md:sticky md:top-8 md:w-1/3">
              {avatarSection}
            </div>
            <div className="w-full md:w-2/3">{userInfo}</div>
          </div>
        );
      case "minimalist":
        return (
          <div className="container mx-auto flex max-w-4xl flex-col items-center gap-8 px-4 py-8 sm:px-8">
            <div className="h-32 w-32 overflow-hidden rounded-full ring-2 ring-primary/20">
              {avatarSection}
            </div>
            <div className="space-y-4 text-center">
              <h1 className="text-4xl font-bold">{heroSection.fullName}</h1>
              <p className="text-xl text-primary">{heroSection.title}</p>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                {heroSection.description}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {heroSection.skills?.map((skill, index) => (
                <Badge key={index} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
            <div className="flex gap-4">{socialLinks}</div>
          </div>
        );
      case "banner":
        return (
          <div className="relative overflow-hidden bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground">
            <div className="bg-grid-white/10 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
            <div className="container relative z-10 flex flex-col items-center gap-8 p-8 px-4 sm:px-8 lg:flex-row lg:p-16">
              <div className="h-48 w-48 overflow-hidden rounded-full shadow-2xl ring-4 ring-primary/20">
                {avatarSection}
              </div>
              <div className="flex-1 text-center lg:text-left">
                <h1 className="mb-2 text-4xl font-bold lg:text-6xl">
                  {heroSection.fullName}
                </h1>
                <p className="mb-4 text-xl text-primary lg:text-2xl">
                  {heroSection.title}
                </p>
                <p className="mb-6 max-w-2xl text-lg">
                  {heroSection.description}
                </p>
                <div className="mb-4 flex flex-wrap justify-center gap-2 lg:justify-start">
                  {heroSection.skills?.map((skill, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-primary/10"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4 lg:justify-start">
                  {socialLinks}
                </div>
              </div>
            </div>
          </div>
        );
      case "modern":
        return (
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="grid gap-12 md:grid-cols-2">
              <div className="flex flex-col justify-center space-y-6">
                <h1 className="text-5xl font-bold tracking-tight">
                  {heroSection.fullName}
                </h1>
                <p className="text-2xl font-medium text-primary">
                  {heroSection.title}
                </p>
                <p className="text-lg text-muted-foreground">
                  {heroSection.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {heroSection.skills?.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-4">{socialLinks}</div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-64 w-64 overflow-hidden rounded-full shadow-2xl ring-4 ring-primary/20">
                  {avatarSection}
                </div>
              </div>
            </div>
          </div>
        );
      case "dynamic":
        return (
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5 p-8 lg:p-12">
              <div className="bg-grid-white/10 absolute inset-0 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))]" />
              <div className="relative z-10 flex flex-col items-center gap-8 lg:flex-row lg:items-start">
                <div className="lg:w-1/3">
                  <div className="relative h-64 w-64 overflow-hidden rounded-2xl shadow-2xl transition-transform duration-300 hover:scale-105">
                    {avatarSection}
                  </div>
                </div>
                <div className="space-y-6 text-center lg:w-2/3 lg:text-left">
                  <h1 className="text-4xl font-bold tracking-tight lg:text-6xl">
                    {heroSection.fullName}
                  </h1>
                  <p className="text-2xl font-medium text-primary">
                    {heroSection.title}
                  </p>
                  <p className="text-lg text-muted-foreground">
                    {heroSection.description}
                  </p>
                  <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
                    {heroSection.skills?.map((skill, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary/10 text-sm transition-colors duration-200 hover:bg-primary/20"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-center gap-4 lg:justify-start">
                    {socialLinks}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case "elegant":
        return (
          <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
            <Card className="overflow-hidden">
              <CardContent className="p-0">
                <div className="grid md:grid-cols-2">
                  <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-8 lg:p-12">
                    <div className="mb-8 flex justify-center md:justify-start">
                      <div className="h-48 w-48 overflow-hidden rounded-full shadow-lg ring-4 ring-primary/20">
                        {avatarSection}
                      </div>
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                      <h1 className="text-3xl font-bold lg:text-5xl">
                        {heroSection.fullName}
                      </h1>
                      <p className="text-xl text-primary lg:text-2xl">
                        {heroSection.title}
                      </p>
                    </div>
                  </div>
                  <div className="p-8 lg:p-12">
                    <div className="space-y-6">
                      <p className="text-lg text-muted-foreground">
                        {heroSection.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {heroSection.skills?.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-sm"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-4">{socialLinks}</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div id="about-me" className="relative w-full">
      {canEdit && (
        <div className="absolute left-0 top-0 z-20 w-full py-3">
          <section className="container mx-auto flex justify-between gap-4 px-4 lg:justify-end lg:px-8">
            <Select value={layoutStyle} onValueChange={handleLayoutStyleChange}>
              <SelectTrigger className="w-auto md:w-[180px]">
                <SelectValue placeholder="Select a layout" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classic">
                  <div className="flex items-center">
                    <Layout className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Classic</p>
                  </div>
                </SelectItem>
                <SelectItem value="spotlight">
                  <div className="flex items-center">
                    <Layers className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Spotlight</p>
                  </div>
                </SelectItem>
                <SelectItem value="sidekick">
                  <div className="flex items-center">
                    <Columns className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Sidekick</p>
                  </div>
                </SelectItem>
                <SelectItem value="minimalist">
                  <div className="flex items-center">
                    <Grid className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Minimalist</p>
                  </div>
                </SelectItem>
                <SelectItem value="banner">
                  <div className="flex items-center">
                    <Maximize className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Banner</p>
                  </div>
                </SelectItem>
                <SelectItem value="modern">
                  <div className="flex items-center">
                    <Monitor className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Modern</p>
                  </div>
                </SelectItem>
                <SelectItem value="dynamic">
                  <div className="flex items-center">
                    <Sparkles className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Dynamic</p>
                  </div>
                </SelectItem>
                <SelectItem value="elegant">
                  <div className="flex items-center">
                    <Palette className="mr-2 h-4 w-4" />
                    <p className="hidden md:flex"> Elegant</p>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            {user && canEdit && (
              // <AvatarEditor
              //   avatarOptions={avatarOptions}
              //   setAvatarOptions={setAvatarOptions}
              //   user={user}
              // />
              <EditHeroSectionDialog
                {...{ avatarOptions, setAvatarOptions }}
                routeId={heroSection.routeId}
                heroSection={heroSection}
                user={user}
              />
            )}
          </section>
        </div>
      )}
      {/* {canEdit && user && (
        <EditHeroSectionDialog
          routeId={heroSection.routeId}
          heroSection={heroSection}
          user={user}
          className="absolute left-4 top-4 z-10"
        />
      )} */}
      <div className="">{renderContent()}</div>
    </div>
  );
}
