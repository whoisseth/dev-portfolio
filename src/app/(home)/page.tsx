"use server";

import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { getAllUsers } from "@/actions/create-portfolio-actions";
import { UserTableComponent } from "./_components/user-table";
import { Suspense } from "react";
import { UserTableSkeletonComponent } from "./_components/user-table-skeleton";

export default async function HomePage() {
  const user = await getCurrentUser();
  const allUsers = await getAllUsers();

  console.log("allUsers", allUsers);

  return (
    <div className="flex flex-grow flex-col-reverse gap-4 p-4 md:flex-row">
      {/* left div */}
      {/* {JSON.stringify(allUsers)} */}
      <section className="md:pt-4 flex w-full max-w-full flex-col items-center justify-center space-y-4 px-4 md:w-1/2">
        {allUsers.length > 0 && (
          <Suspense fallback={<UserTableSkeletonComponent />}>
            <UserTableComponent users={allUsers} />
          </Suspense>
        )}
        {/* <UserTableSkeletonComponent/> */}
      </section>

      {/* right div */}
      <section className="flex w-full max-w-full flex-col items-center justify-center space-y-4 md:w-1/2">
        <div className="flex w-full max-w-xs flex-col gap-4">
          {user ? (
            <Link
              prefetch={false}
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "w-full",
              )}
              href={"/api/sign-out"}
            >
              Log Out
            </Link>
          ) : (
            <Link
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "w-full",
              )}
              href={`/sign-in?returnTo=${encodeURIComponent("/create-portfolio")}`}
            >
              Log In
            </Link>
          )}

          <Link
            className={cn(
              buttonVariants({ variant: "default", size: "lg" }),
              "w-full",
            )}
            href={"/create-portfolio"}
          >
            Create Your Portfolio
          </Link>
        </div>
      </section>
    </div>
  );
}
