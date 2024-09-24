import React from "react";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {};

export default function EditProfileImgDialog({}: Props) {
  const avatar = createAvatar(notionists, {
    seed: "utkarsh",
    beard: ["variant03"],
    body: ["variant03"],
  });

  const svg = avatar.toString();

  return (
    <Dialog>
      <DialogTrigger>
        <Button className="absolute right-10 top-10" variant={"outline"}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center">
          <div className="h-32 w-32 rounded-full bg-gray-100">
            {/* <img src={svg} alt="Avatar" /> */}
            {/* <Svg /> */}
            <div
              className="h-32 w-32 rounded-full bg-gray-100"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
