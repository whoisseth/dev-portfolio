"use server";

import HomePageNavbar from "./_components/home-page-navbar";
import HeroSection from "./_components/hero-section";
import FeaturesSection from "./_components/features-section";
import { getCurrentUser } from "@/lib/session";
import { getProfile } from "@/data-access/profiles";

export default async function HomePage() {
  const user = await getCurrentUser();
  const profile = await getProfile(user?.id ?? 0);

  return (
    <>
      <HomePageNavbar user={user} profile={profile} />
      <div className="container flex h-full flex-grow flex-col items-center justify-center gap-4 px-2 py-2 sm:py-4 md:px-4">
        <HeroSection />
        <FeaturesSection />
      </div>
    </>
  );
}
// export default async function HomePage() {
//   const user = await getCurrentUser();

//   return (
//     <div className="flex h-full flex-grow flex-col items-center justify-center gap-4 px-2 py-2 sm:py-4 md:px-4">
//       <section className="container flex w-full flex-col items-center justify-center gap-4 lg:flex-row">
//         <RightSection user={user} />
//         <Suspense fallback={<UserTableSkeletonComponent />}>
//           <UserTableWrapper />
//         </Suspense>
//       </section>
//     </div>
//   );
// }
