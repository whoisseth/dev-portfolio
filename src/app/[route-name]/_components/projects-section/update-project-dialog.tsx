"use client";

import { useState, useTransition, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { updateProject } from "@/actions/create-portfolio-actions";
import { useToast } from "@/components/ui/use-toast";
import { Project } from "@/db/schema";
import { projectSchema } from "./add-project-dialog";
import { Plus, X } from "lucide-react";

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
  const { toast } = useToast();
  const tagInputRef = useRef<HTMLInputElement>(null);

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

  const { isDirty } = form.formState;

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
          userId: userRoute.userId,
          routeId: userRoute.routeId,
          id: project.id,
        });

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

  const addTag = (tags: string[], onChange: (value: string[]) => void) => {
    const newTag = tagInputRef.current?.value.trim();
    if (newTag && !tags.includes(newTag)) {
      onChange([...tags, newTag]);
      if (tagInputRef.current) {
        tagInputRef.current.value = "";
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex-1">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>
            Update the details of your existing project. Click Update when
            you're done.
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
                    <Controller
                      name="tags"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <div>
                          <div className="mb-2 flex flex-wrap gap-2">
                            {value.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-sm"
                              >
                                {tag}
                                <button
                                  type="button"
                                  onClick={() => {
                                    const newTags = [...value];
                                    newTags.splice(index, 1);
                                    onChange(newTags);
                                  }}
                                  className="ml-1 hover:text-destructive focus:outline-none"
                                >
                                  <X size={14} />
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Input
                              ref={tagInputRef}
                              placeholder="Add a new tag"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  e.preventDefault();
                                  addTag(value, onChange);
                                }
                              }}
                              className="flex-grow"
                            />
                            <Button
                              type="button"
                              // size={"icon"}
                              onClick={() => addTag(value, onChange)}
                              // className="ml-2"
                            >
                              {/* <Plus size={16} /> */}
                              Add Tag
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Type a new tag and press Enter or click "Add Tag" to add.
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
              <Button disabled={isPending || !isDirty} type="submit">
                {isPending ? "Updating..." : "Update Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
