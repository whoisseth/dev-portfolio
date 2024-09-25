"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
import { deleteWorkExperience } from "@/actions/create-portfolio-actions";
// import { toast, useToast } from "@/components/ui/use-toast";
// import { toast, useToast } from "@/components/ui/use-toast";
import { WorkExperience } from "@/db/schema";
import { toast } from "sonner";

interface DeleteWorkExperienceDialogProps {
  workExperience: WorkExperience;
}

export function DeleteWorkExperienceDialog({
  workExperience,
}: DeleteWorkExperienceDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  //   const { toast } = useToast();

  async function handleDeleteWorkExperience() {
    if (!workExperience.id) {
      return;
    }
    setIsDeleting(true);
    try {
      await deleteWorkExperience(workExperience.id);
      toast.success("Work experience deleted successfully");
      setIsOpen(false);
    } catch (error) {
      toast.error("Failed to delete work experience");
      console.error("Error deleting work experience:", error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="h-8 text-xs" size="sm">
          <Trash size={14} className="mr-1 h-3 w-3" /> Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Work Experience</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the work experience "
            {workExperience.jobTitle}"? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteWorkExperience}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
