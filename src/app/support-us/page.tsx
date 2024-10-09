import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import SupportUsNavbar from "./_components/navbar";
import Link from "next/link";
import Contribution from "./_components/contribution";
import { getCurrentUser } from "@/lib/session";
import { getProfile, getUserEmailAndName } from "@/data-access/profiles";

export default async function SupportUsPage() {
  const user = await getCurrentUser();
  const userNameAndEmail = await getUserEmailAndName(user?.id ?? 0);
  const profile = await getProfile(user?.id ?? 0);
  return (
    <>
      {" "}
      <SupportUsNavbar user={user} profile={profile} />
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-center text-4xl font-bold">
          Support{" "}
          <Link href="/" className="text-blue-500 hover:text-blue-600">
            Portly.dev
          </Link>
        </h1>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col-reverse gap-8 md:flex-row">
            <Card className="flex-1">
              <CardHeader>
                <CardTitle>Why Support Us?</CardTitle>
                <CardDescription>
                  Your contribution helps us maintain and improve Portly,
                  ensuring it remains a powerful, free tool for developers
                  worldwide.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">With your support, we can:</p>
                <ul className="mb-4 list-inside list-disc space-y-2">
                  <li>Develop new features to enhance portfolio creation</li>
                  <li>Maintain our servers and infrastructure</li>
                  <li>Provide timely support and bug fixes</li>
                  <li>Create educational content and resources</li>
                </ul>
                <p>
                  Every contribution, no matter the size, makes a significant
                  impact on our project's future.
                </p>
              </CardContent>
            </Card>

            <Contribution userNameAndEmail={userNameAndEmail} />
          </div>
        </div>
      </div>
    </>
  );
}
