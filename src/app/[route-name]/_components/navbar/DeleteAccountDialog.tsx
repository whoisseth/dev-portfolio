"use client";

import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Dialog, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTransition } from "react";
import { User } from "lucia";
import { useRouter } from "next/navigation";
import { deleteUser } from "@/data-access/users";
import { toast } from "sonner";

export function DeleteAccountDialog({
  isOpen,
  setIsOpen,
  user,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  user: User;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleDeleteAccount() {
    startTransition(async () => {
      // Call the API to delete user images
      await fetch("/api/delete-user-images", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user.id }),
      });

      // Delete the user
      await deleteUser(user.id);
      router.push("/");
      setIsOpen(false);
      //   also added a toast messge

      toast.success("User has been deleted");
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Account</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete your account? This action cannot be
          undone.
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDeleteAccount}>
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
