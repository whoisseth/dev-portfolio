"use server";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";

import { getAllUsers } from "@/actions/create-portfolio-actions";
import { UserTableComponent } from "./_components/user-table";
import { Suspense } from "react";
import { UserTableSkeletonComponent } from "./_components/user-table-skeleton";
import RightSection from "./_components/right-section";

export default async function HomePage() {
  const user = await getCurrentUser();
  const allUsers = await getAllUsers();

  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center gap-4 px-2 py-2 sm:py-4 md:px-4">
      <section className="container flex w-full flex-col items-center justify-center gap-4 lg:flex-row ">
        <RightSection user={user} />
        {allUsers.length > 0 && (
          <div className="">
            <Suspense fallback={<UserTableSkeletonComponent />}>
              <UserTableComponent users={allUsers} />
            </Suspense>
          </div>
        )}
      </section>
    </div>
  );
}
