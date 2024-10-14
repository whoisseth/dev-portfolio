import { signOutAction } from "@/actions/sign-out";
import { validateRequest } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import * as NProgress from "nprogress";

export async function GET(): Promise<Response> {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const { session } = await validateRequest();
  if (!session) {
    redirect("/sign-in");
  }
  NProgress.start();
  signOutAction().then(() => {
    NProgress.done();
  });
  redirect("/signed-out");
}
