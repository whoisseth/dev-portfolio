"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import LaptopSvg from "./svg/laptop";
import { Briefcase, Github, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { AboutMe } from "@/db/schema";

type HeroProps = {
  aboutMe: AboutMe;
};

export function Hero({ aboutMe }: HeroProps) {
  return (
    <div
      id="about-me"
      className="container mx-auto py-12 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        <div className="flex-1 lg:text-left">
          <div>
            <h1 className="text-4xl font-bold leading-tight md:text-5xl">
              {aboutMe.fullName}
            </h1>
            <p className="text-xl text-gray-300 sm:text-3xl md:text-2xl">
              {aboutMe.title}
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-4xl">
            {aboutMe.tagline}
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base lg:mx-0">
            {aboutMe.description}
          </p>
          {/* extra details  */}
          <div className="mt-4 space-y-3">
            {aboutMe.email && (
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">{aboutMe.email}</span>
              </div>
            )}
            {aboutMe.skills && (
              <div className="flex items-center space-x-2">
                <Briefcase className="h-4 w-4" />
                <span className="text-sm">
                  {Array.isArray(aboutMe.skills) ? aboutMe.skills.join(", ") : aboutMe.skills}
                </span>
              </div>
            )}
            {aboutMe.phoneNumber && (
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">{aboutMe.phoneNumber}</span>
              </div>
            )}
            {aboutMe.linkedIn && (
              <div className="flex items-center space-x-2">
                <Linkedin className="h-4 w-4" />
                <Link
                  target="_blank"
                  href={aboutMe.linkedIn || ""}
                  className="text-sm hover:underline"
                >
                  {aboutMe.linkedIn?.replace("https://", "")}
                </Link>
              </div>
            )}
            {aboutMe.github && (
              <div className="flex items-center space-x-2">
                <Github className="h-4 w-4" />
                <Link
                  target="_blank"
                  href={aboutMe.github || ""}
                  className="hover:underline"
                >
                  {aboutMe.github?.replace("https://", "")}
                </Link>
              </div>
            )}
          </div>
          {/*  */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-start">
            <Button size="default">View Projects</Button>
            <Button size="default" variant="outline">
              View Resume
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3 lg:max-w-none">
          <LaptopSvg className="h-auto w-full" />
        </div>
      </div>
    </div>
  );
}
