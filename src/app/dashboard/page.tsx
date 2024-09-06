import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import { Header } from "../_header/header";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div>
      <Header />
      <h1>Dashboard</h1>

      <p>put your dashboardy stuff here</p>
    </div>
  );
}
