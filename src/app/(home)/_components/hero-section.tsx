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
    <section className="relative overflow-hidden">
      <div className="animate-gradient-fade absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background"></div>
      <BackgroundLines>
        <div className="relative">
          <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 lg:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-8">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Build Your Portfolio
                  <span className="block bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
                    Effortlessly
                  </span>
                </h1>
                <p className="max-w-2xl text-xl text-muted-foreground">
                  Create stunning portfolios in seconds with{" "}
                  <Link href="/" className="text-primary hover:underline">
                    portly.dev
                  </Link>
                  . Stand out from the crowd and land your dream opportunities.
                </p>
                <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Button
                    variant="default"
                    asChild
                    size="lg"
                    className="text-lg"
                  >
                    <Link href="/create-portfolio">
                      Create Your Portfolio
                      <ArrowRightIcon className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <p className="flex items-center text-sm text-muted-foreground">
                    <span className="mr-2 font-bold text-primary">
                      {allUsers.length}
                    </span>{" "}
                    people have created their portfolios
                  </p>
                </div>
              </div>
              <div className="relative">
                <Suspense fallback={<UserTableSkeletonComponent />}>
                  <UserTableWrapper />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </BackgroundLines>
    </section>
  );
}
