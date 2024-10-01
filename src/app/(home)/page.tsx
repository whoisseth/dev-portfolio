"use server";
import { getCurrentUser } from "@/lib/session";
import { Suspense } from "react";
import { UserTableSkeletonComponent } from "./_components/user-table-skeleton";
import RightSection from "./_components/right-section";
import { UserTableWrapper } from "./_components/user-table-wrapper";

export default async function HomePage() {
  const user = await getCurrentUser();

  return (
    <div className="flex h-full flex-grow flex-col items-center justify-center gap-4 px-2 py-2 sm:py-4 md:px-4">
      <section className="container flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
        <RightSection user={user} />
        <Suspense fallback={<UserTableSkeletonComponent />}>
          <UserTableWrapper />
        </Suspense>
      </section>
    </div>
  );
}
