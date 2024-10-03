import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/session";
import {
  getUserRoute,
  getHeroSectionData,
} from "@/actions/create-portfolio-actions";
import Notification from "@/components/notification";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { "route-name": string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const routeName = params["route-name"];
    console.log("Generating metadata for route:", routeName);

    const heroSection = await getHeroSectionData(routeName);

    if (!heroSection) {
      console.log(`No hero section found for route: ${routeName}`);
      return {
        title: "Portfolio Not Found",
        description: "The requested portfolio could not be found.",
      };
    }

    const metadata = {
      title: `${heroSection.hero_section.fullName} - ${heroSection.hero_section.title}`,
      description: heroSection.hero_section.description,
    };

    console.log("Generated metadata:", metadata);

    return metadata;
  } catch (error) {
    console.error("Error generating metadata:", error);
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return {
      title: "Error",
      description: "An error occurred while generating metadata.",
    };
  }
}

const SHOW_NEW_FEATURE_NOTIFICATION = true;

export default async function Layout({
  children,
  params,
}: { children: ReactNode } & { params: { "route-name": string } }) {
  const user = await getCurrentUser();
  const userRoute = await getUserRoute(user?.id || null);

  return (
    <div>
      {/*  */}
      {SHOW_NEW_FEATURE_NOTIFICATION && (
        <Notification message="New feature: Now you can now fully customize your avatar in your profile settings!" />
      )}
      <Navbar user={user} userRoute={userRoute} />
      <div className="container mx-auto w-full px-4 sm:px-8">{children}</div>
    </div>
  );
}
