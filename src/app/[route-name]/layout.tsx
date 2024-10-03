import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/session";
import { getUserRoute } from "@/actions/create-portfolio-actions";
import Notification from "@/components/notification";
import { getHeroSectionData } from "@/actions/create-portfolio-actions";

import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};
// this is the reference for dynamic metadata
// https://nextjs.org/docs/app/building-your-application/optimizing/metadata#dynamic-metadata
export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const routeName = params.id;
    const heroSection = await getHeroSectionData(routeName);

    if (!heroSection) {
      return {
        title: "Default Title",
        description: "Default Description",
      };
    }

    return {
      title: `${heroSection.hero_section.fullName} - ${heroSection.hero_section.title}`,
      description: heroSection.hero_section.description,
    };
  } catch (error) {
    console.error("Error fetching hero section data:", error);
    return {
      title: "Error",
      description: "An error occurred while fetching metadata.",
    };
  }
}

const SHOW_NEW_FEATURE_NOTIFICATION = true;

// export const metadata: Metadata = {
//   title: "Portly Dev Portfolio Builder",
//   icons: [
//     { rel: "icon", type: "image/png", sizes: "48x48", url: "/favicon.ico" },
//   ],
//   keywords: "Portfolio",
//   description:
//     "Portly is Dev Portfolio Builder: A simple, customizable tool to create and showcase professional developer portfolios with ease.",
// };

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  const userRoute = await getUserRoute(user?.id || null);
  return (
    <div>
      {SHOW_NEW_FEATURE_NOTIFICATION && (
        <Notification message="New feature: Now you can now fully customize your avatar in your profile settings!" />
      )}
      <Navbar user={user} userRoute={userRoute} />
      <div className="container mx-auto w-full px-4 sm:px-8">{children}</div>
    </div>
  );
}
