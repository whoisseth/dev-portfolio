import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Header } from "../_header/header";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <Header />
      <h1>Dashboard</h1>

      <p>put your dashboard stuff here</p>

      <Link
        prefetch={false}
        className={cn(buttonVariants({ variant: "secondary" }))}
        href={"/api/sign-out"}
      >
        Log Out
      </Link>
      <Link className={cn(buttonVariants({ variant: "default" }))} href={"/"}>
        Home page
      </Link>
    </div>
  );
}
