"use client";

import { useState, useTransition } from "react";
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
import { Project } from "@/db/schema";
import { deleteProject } from "@/actions/project_actions";
import { toast } from "sonner";

interface DeleteProjectDialogProps {
  project: Project;
  children?: React.ReactNode;
  routeName: string;
}

export function DeleteProjectDialog({
  project,
  children,
  routeName,
}: DeleteProjectDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function handleDeleteProject() {
    startTransition(async () => {
      try {
        if (!project.id) {
          throw new Error("Project ID is undefined");
        }
        await deleteProject(project.id, routeName);
        if (project.imageUrl) {
          await fetch("/api/delete-image", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ imageUrl: project.imageUrl }),
          });
        }

        toast.success("Project deleted successfully");
        setIsOpen(false);
      } catch (error) {
        toast.error("Failed to delete project");
        console.error("Error deleting project:", error);
      }
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="destructive" className="flex-1" size="sm">
            <Trash size={14} className="mr-1 h-3 w-3" /> Delete
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Project</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete the project "{project.title}"? This
            action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteProject}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
