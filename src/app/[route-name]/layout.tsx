import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/session";
import { getUserRoute } from "@/actions/create-portfolio-actions";



export default async function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const user = await getCurrentUser();
  const userRoute = await getUserRoute(user?.id || null);
  return (
    <div>
      <Navbar user={user} userRoute={userRoute} />
      <div className="container mx-auto w-full px-4 sm:px-8">{children}</div>
    </div>
  );
}
