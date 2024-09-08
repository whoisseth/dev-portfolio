import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";

type Props = {};

export default function CreatePortfolio({}: Props) {
  return (
    <div>
      <div>
        <Link className="flex items-center" href={"/api/sign-out"}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Link>
      </div>

      <p>Create Portfolio page </p>
    </div>
  );
}
