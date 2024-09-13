"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import LaptopSvg from "./svg/laptop";
import { Briefcase, Github, Linkedin, Mail, Phone } from "lucide-react";
import Link from "next/link";

export function Hero() {
  return (
    <div
      id="about-me"
      className="container mx-auto py-12 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        <div className="flex-1 lg:text-left">
          <div>
            <h1 className=" font-bold leading-tight text-4xl md:text-5xl">
              John Doe
            </h1>
            <p className="text-xl text-gray-300 sm:text-3xl md:text-2xl">
              Frontend Developer
            </p>
          </div>
          <h2 className="mt-4 text-3xl font-bold leading-tight sm:text-4xl md:text-4xl ">
            Passionate About Frontend developer
          </h2>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground sm:text-base lg:mx-0">
            {` Frontend developer skilled in React, Next.js, TailwindCSS, and TypeScript. I build responsive, scalable web apps with a focus on reusable components and seamless user experiences. Let’s bring your vision to life!`}
          </p>
          {/* extra details  */}
          <div className="mt-4  space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="h-4 w-4" />
              <span className="text-sm">john.doe@example.com</span>
            </div>
            <div className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span className="text-sm">
                React, Next.js, TailwindCSS, TypeScript
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4" />
              <span className="text-sm">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-2">
              <Linkedin className="h-4 w-4" />
              <Link
                target="_blank"
                href="https://linkedin.com/in/johndoe"
                className="text-sm hover:underline"
              >
                linkedin.com/in/johndoe
              </Link>
            </div>
            <div className="flex items-center space-x-2">
              <Github className="h-4 w-4" />
              <Link
                target="_blank"
                href="https://github.com/johndoe"
                className="hover:underline"
              >
                github.com/johndoe
              </Link>
            </div>
          </div>
          {/*  */}
          <div className="mt-8 flex flex-col gap-4 sm:flex-row lg:justify-start">
            <Button size="default">View Projects</Button>
            <Button size="default" variant="outline">
              View Resume
            </Button>
          </div>
        </div>
        <div className="flex w-full max-w-2xl flex-1 flex-col items-center justify-center gap-3  lg:max-w-none">
          <LaptopSvg className="h-auto w-full " />
          {/* <Image
            src="/placeholder.svg?height=600&width=600"
            alt="Hero Image"
            width={600}
            height={600}
            className="h-auto w-full rounded-lg shadow-lg"
          /> */}
        </div>
      </div>
    </div>
  );
}
