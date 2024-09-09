// "use server";

import { Button, buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import Link from "next/link";
import { redirect } from "next/navigation";
import CreatePortfolioBtn from "./_components/create-portfolioBtn";
import { cn } from "@/lib/utils";

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
        {user ? (
          <Link
            className={cn(buttonVariants({ variant: "secondary" }))}
            href={"/api/sign-out"}
          >
            Lout Out
          </Link>
        ) : (
          <Button variant={"secondary"}>Login</Button>
        )}
      </Link>
      <CreatePortfolioBtn user={user} />
    </div>
  );
}
