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
import { addProject } from "@/actions/create-portfolio-actions";
import { Project, UserRoute } from "@/db/schema";
import { useToast } from "@/components/ui/use-toast";
import { X } from "lucide-react";

export const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  liveLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  codeLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type Props = {
  userRoute: {
    routeName: string;
    routeId: number;
    userId: number;
  };
};

export function AddProjectDialogComponent({ userRoute }: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const tagInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageUrl: "",
      tags: [],
      liveLink: "",
      codeLink: "",
    },
  });

  const { isDirty } = form.formState;

  async function onSubmit(data: ProjectFormValues) {
    startTransition(async () => {
      try {
        await addProject({
          ...data,
          imageUrl: data.imageUrl || null,
          liveLink: data.liveLink || null,
          codeLink: data.codeLink || null,
          userId: userRoute.userId,
          routeId: userRoute.routeId,
        });

        toast({
          title: "Success",
          description: "Project added successfully!",
          variant: "default",
        });

        setOpen(false);
        form.reset();
      } catch (error) {
        console.error("Error adding project:", error);
        toast({
          title: "Error",
          description: `Failed to add project. Please try again.- ${error} `,
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
        <Button variant="outline">Add Project</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details of your new project. Click add when you're done.
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
                          <div className="flex">
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
                              onClick={() => addTag(value, onChange)}
                              className="ml-2"
                            >
                              Add Tag
                            </Button>
                          </div>
                        </div>
                      )}
                    />
                  </FormControl>
                  <FormDescription>
                    Type a new tag and press Enter or click "Add Tag" to add it.
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
                {isPending ? "Adding..." : "Add Project"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
