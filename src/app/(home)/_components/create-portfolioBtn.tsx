"use client";

import { Button } from "@/components/ui/button";
// import { User } from "@/db/schema";
import { useRouter } from "next/navigation";
import React from "react";
import { User } from "lucia";

type Props = {
  // handlePortfolioBtn: () => void;
  user: User | undefined;
};

export default function CreatePortfolioBtn({ user }: Props) {
  const router = useRouter();
  console.log("user", user);

  function handlePortfolioBtn() {
    // check if user portfolio have **already their ** a/c
    // then redirect - '/route-name', the route that linked with userid

    // if (route already exist for that user ) redirect("/route-name")
    if (user) {
      router.push("/create-portfolio");
    } else {
      router.push("/sign-in");
    }
  }

  return <Button onClick={handlePortfolioBtn}>Create Portfolio</Button>;
}
