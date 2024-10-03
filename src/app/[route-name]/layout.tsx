import React, { ReactNode } from "react";
import Navbar from "./_components/navbar";
import { getCurrentUser } from "@/lib/session";
import { getUserRoute } from "@/actions/create-portfolio-actions";
import Notification from "@/components/notification";

const SHOW_NEW_FEATURE_NOTIFICATION = true;

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
