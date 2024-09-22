"use client";

import { useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { addProject, updateProject } from "@/actions/create-portfolio-actions";
import { useToast } from "@/components/ui/use-toast";
import { FilePen, PenIcon } from "lucide-react";
import { Project } from "@/db/schema";
import { projectSchema } from "./add-project-dialog";

type ProjectFormValues = z.infer<typeof projectSchema>;

type Props = {
  project: Project;
  userRoute: {
    routeName: string;
    routeId: number;
    userId: number;
  };
};

export function UpdateProjectDialogComponent({ userRoute, project }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  useTransition;
  const { toast } = useToast();

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      imageUrl: project.imageUrl ?? undefined,
      tags: project.tags,
      liveLink: project.liveLink ?? undefined,
      codeLink: project.codeLink ?? undefined,
    },
  });

  async function onSubmit(data: ProjectFormValues) {
    startTransition(async () => {
      try {
        await updateProject({
          title: data.title,
          description: data.description,
          imageUrl: data.imageUrl,
          tags: data.tags,
          liveLink: data.liveLink,
          codeLink: data.codeLink,
          userId: userRoute.userId, // Add this line
          routeId: userRoute.routeId, // Add this line
          id: project.id,
        });
        // await addProject({
        //   ...data,
        //   imageUrl: data.imageUrl || null,
        //   liveLink: data.liveLink || null,
        //   codeLink: data.codeLink || null,
        //   userId: userRoute.userId,
        //   routeId: userRoute.routeId,
        // });

        toast({
          title: "Success",
          description: "Project Updated successfully!",
          variant: "default",
        });

        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Error updating project:", error);
        toast({
          title: "Error",
          description: `Failed to update project. Please try again.- ${error} `,
          variant: "destructive",
        });
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {/* <Button
          variant="outline"
          size="sm"
          className="flex items-center mt-2 mx-2 space-x-2 transition-all duration-200 ease-in-out hover:bg-primary hover:text-primary-foreground"
        >
          <PenIcon className="h-4 w-4" />
          <span>Edit Project</span>
        </Button> */}

        <Button
          variant={"outline"}
          size={"sm"}
          className="absolute left-1 top-1 z-50"
        >
          <FilePen size={16} className="mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>
            Update the details of your existing project. Click Update when
            you're done.
            {/* -{JSON.stringify(userRoute)} */}
            {/* project-{JSON.stringify(project)} */}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Project Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Project Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/image.jpg"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="React, TypeScript, Node.js"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(",").map((tag) => tag.trim()),
                        )
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Enter tags separated by commas.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="liveLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Live Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://myproject.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codeLink"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Link</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://github.com/myproject"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="mt-4">
              <Button disabled={isPending} type="submit">
                {isPending ? "Updating..." : "Update Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
