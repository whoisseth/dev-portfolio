import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/session";
import { checkUserPortfolio } from "@/actions/create-portfolio-actions";

type Props = {};

export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <div>
      <Navbar user={user} />
      <div className="container mx-auto w-full px-4 py-12 sm:px-8">
        {children}
      </div>
    </div>
  );
}
