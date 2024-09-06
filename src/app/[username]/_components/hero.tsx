"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import LaptopSvg from "./svg/laptop";

export function Hero() {
  return (
    <div
      id="about-us"
      className="container mx-auto  px-4 py-12 sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="flex flex-col items-center gap-12 lg:flex-row">
        <div className="flex-1 text-center lg:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            Passionate Frontend Developer
          </h1>
          <p className="mx-auto mt-4 max-w-3xl text-xl text-muted-foreground lg:mx-0">
            {` Frontend developer skilled in React, Next.js, TailwindCSS, and TypeScript. I build responsive, scalable web apps with a focus on reusable components and seamless user experiences. Let’s bring your vision to life!`}
          </p>
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
            <Button size="lg">View Projects</Button>
            <Button size="lg" variant="outline">
              View Resume
            </Button>
          </div>
        </div>
        <div className="w-full max-w-2xl flex-1 lg:max-w-none">
          <LaptopSvg className="h-auto w-full" />
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
