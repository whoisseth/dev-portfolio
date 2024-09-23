"use server";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/actions/create-portfolio-actions";
import { UserTableComponent } from "./_components/user-table";
import { Suspense } from "react";
import { UserTableSkeletonComponent } from "./_components/user-table-skeleton";
import RightSection from "./_components/right-section";

export default async function HomePage() {
  const user = await getCurrentUser();
  const allUsers = await getAllUsers();

  // console.log("allUsers", allUsers);

  return (
    <div className="flex flex-grow flex-col-reverse items-center gap-4 px-2 py-2 sm:px-4 sm:py-4 md:flex-row">
      {/* left div */}
      {/* {JSON.stringify(allUsers)} */}
      <section className="flex w-full max-w-full flex-col items-center justify-center space-y-4 sm:px-4 md:w-1/2 md:pt-4">
        {allUsers.length > 0 && (
          <Suspense fallback={<UserTableSkeletonComponent />}>
            <UserTableComponent users={allUsers} />
          </Suspense>
        )}
       
      </section>
      <RightSection user={user} />
    </div>
  );
}
