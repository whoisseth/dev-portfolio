
import { User } from "lucia";
import Link from "next/link";
import React from "react";
import Buttons from "./buttons";

type Props = {
  user: User | undefined;
};

export default function RightSection({ user }: Props) {
  return (
    <div className="h-fit rounded-md bg-muted/50  p-6 lg:w-1/2">
      <h1 className="mb-4 text-3xl font-bold">
        Build Your{" "}
        <span className="underline underline-offset-4">
          Developer Portfolio
        </span>{" "}
        Effortlessly
      </h1>
      <p className="mb-6 text-muted-foreground">
        <Link href="/" className="font-bold text-blue-500 hover:underline">
          Portly.dev
        </Link>{" "}
        makes it simple for developers to create and showcase professional
        portfolios. Whether you're a seasoned pro or just starting, build,
        customize, and share your work in minutes.
      </p>
      <ul className="mb-6 list-inside list-disc space-y-2">
        <li>Showcase Your Projects</li>
        <li>Highlight Your Skills</li>
        <li>Create Your Unique Portfolio URL</li>
      </ul>
      <h2 className="mb-4 text-2xl font-semibold">Ready to stand out?</h2>
      <p className="mb-4">Click below to get started!</p>
      <Buttons user={user} />
    </div>
  );
}
