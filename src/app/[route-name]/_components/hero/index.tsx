"use client";

import { buttonVariants } from "@/components/ui/button";
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
import { useState } from "react";
import { User } from "lucia";
import { useCanEditPortfolio } from "@/hooks/useCanEditPortfolio";
import AvatarEditor, { AvatarOptions } from "./_components/avatar-editor";
import { createAvatar, Options } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import EditHeroSectionDialog from "./_components/edit-hero-section-dialog";

type HeroProps = {
  routeName: string;
  heroSection: HeroSection;
  user: User | undefined;
  isProjectsEmpty?: boolean;
};

export function Hero({ heroSection, user, isProjectsEmpty }: HeroProps) {
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

  return (
    <div id="about-me">
      <div className="flex h-full flex-col-reverse items-center gap-12 py-6 sm:py-10 lg:flex-row">
        {/* left side user info */}
        <div className="relative h-full flex-1">
          <div className="flex-1">
            {/* full name */}
            <div>
              <h1 className="text-4xl font-bold leading-tight md:text-5xl">
                {heroSection.fullName}
              </h1>
              <p className="text-xl sm:text-3xl md:text-2xl">
                {heroSection.title && `{ ${heroSection.title} }`}
              </p>
            </div>
            {/* tagline */}
            <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-4xl">
              {heroSection.tagline}
            </h2>

            {/* description */}
            <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base">
              {heroSection.description}
            </p>

            {/* extra details */}
            <div className="mt-4 space-y-3">
              {heroSection.email && (
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{heroSection.email}</span>
                </div>
              )}

              {heroSection.skills && (
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
              )}

              {heroSection.phoneNumber && (
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">{heroSection.phoneNumber}</span>
                </div>
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

            <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-start">
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

          {canEdit && user && (
            <EditHeroSectionDialog
              routeId={heroSection.routeId}
              heroSection={heroSection}
              user={user}
              className="absolute right-0 top-0"
            />
          )}
        </div>
        {/* right side avatar */}
        <div className="relative flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 lg:max-w-none">
          {canEdit && user && (
            <AvatarEditor
              avatarOptions={avatarOptions}
              setAvatarOptions={setAvatarOptions}
              user={user}
              className="absolute right-0 top-0"
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
