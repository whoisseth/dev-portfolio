import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import React, { Suspense } from "react";
import { UserTableWrapper } from "./user-table-wrapper";
import { UserTableSkeletonComponent } from "./user-table-skeleton";
import { BackgroundLines } from "@/components/ui/background-lines";
import { getAllUsers } from "@/actions/create-portfolio-actions";

type Props = {};

export default async function HeroSection({}: Props) {
  const allUsers = await getAllUsers();
  return (
    <>
      <BackgroundLines className="container flex w-full flex-col items-center justify-center gap-2 px-4 sm:px-6 lg:flex-row">
        <section className="flex w-full flex-col gap-4">
          <h2 className="relative z-20 bg-gradient-to-b from-neutral-900 to-neutral-700 bg-clip-text py-2 text-center font-sans text-4xl font-bold tracking-tight text-transparent dark:from-neutral-600 dark:to-white lg:text-left lg:text-6xl">
            Build Your Portfolio Effortlessly
          </h2>
          <p className="z-10 mx-auto max-w-xl text-center text-muted-foreground lg:mx-0 lg:text-left lg:text-lg">
            Create stunning portfolios in seconds with{" "}
            <Link href="/" className="text-blue-500 hover:underline">
              portly.dev
            </Link>{" "}
            Stand out from the crowd and land your dream opportunities.
          </p>
          <section className="mx-auto flex  flex-col  gap-2 lg:mx-0 w-fit">
            <Button variant="default" asChild className="z-10">
              <Link href="/create-portfolio">
                Create Your Portfolio
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="w-full text-center text-sm text-muted-foreground lg:text-left">
              <span className="font-bold text-primary">{allUsers.length}</span>{" "}
              people have created their portfolios.
            </p>
          </section>
        </section>
        <section className="hidden w-1/2 lg:flex lg:justify-end">
          <Suspense fallback={<UserTableSkeletonComponent />}>
            <UserTableWrapper />
          </Suspense>
        </section>
      </BackgroundLines>
      <section className="flex lg:hidden">
        <Suspense fallback={<UserTableSkeletonComponent />}>
          <UserTableWrapper />
        </Suspense>
      </section>
    </>
  );
}
