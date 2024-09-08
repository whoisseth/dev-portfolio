// "use server";

import { Button } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePortfolioBtn from "./_components/create-portfolioBtn";

// export default async function HomePage() {
//   const user = await getCurrentUser();
// if (user) redirect("/dashboard");
//   redirect("/sign-in");
// }
export default async function HomePage() {
  const user = await getCurrentUser();

  console.log("home user", user);

  return (
    <div className="container flex min-h-screen items-center justify-center gap-2">
      <Link href={"/sign-in"}>
        <Button variant={"secondary"}>Login</Button>
      </Link>
      <CreatePortfolioBtn user={user} />
    </div>
  );
}
