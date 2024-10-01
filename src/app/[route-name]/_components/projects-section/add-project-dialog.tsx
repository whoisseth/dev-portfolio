"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
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
import { useToast } from "@/components/ui/use-toast";
import { X, Upload, Trash2, Link } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const projectSchema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description is required"),
  imageSource: z.enum(["upload", "url"]),
  imageFile: z
    .any()
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      `Max file size is 2MB.`,
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      "Only .jpg, .png, and .webp formats are supported.",
    )
    .optional(),
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
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      imageSource: "upload",
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
        let imageUrl = data.imageUrl;
        if (data.imageSource === "upload" && data.imageFile) {
          const formData = new FormData();
          formData.append("image", data.imageFile);
          formData.append("routeId", userRoute.routeId.toString());
          formData.append("userId", userRoute.userId.toString());
          const res = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Image upload failed");
          }

          const uploadResult = await res.json();
          imageUrl = uploadResult.imageUrl;
        }

        const projectData = {
          title: data.title,
          description: data.description,
          imageUrl: imageUrl,
          tags: data.tags,
          liveLink: data.liveLink || null,
          codeLink: data.codeLink || null,
          userId: userRoute.userId,
          routeId: userRoute.routeId,
        };

        const result = await addProject(projectData);

        toast({
          title: "Success",
          description: "Project added successfully!",
          variant: "default",
        });

        setOpen(false);
        form.reset();
        setPreviewImage(null);
      } catch (error) {
        console.error("Error adding project:", error);
        toast({
          title: "Error",
          description: `Failed to add project. Please try again.- ${error}`,
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

  const handleImageChange = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("imageFile", file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleImagePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleImageChange(file);
          }
          break;
        }
      }
    }
  }, []);

  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (items) {
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const file = items[i].getAsFile();
            if (file) {
              handleImageChange(file);
            }
            break;
          }
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  const cancelImage = () => {
    setPreviewImage(null);
    form.setValue("imageFile", undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Project</Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] md:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Add New Project</DialogTitle>
          <DialogDescription>
            Fill in the details of your new project. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:flex md:gap-6 md:space-y-0"
            onPaste={handleImagePaste}
          >
            <div className="space-y-4 md:w-1/2">
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
                      <Textarea
                        placeholder="Project Description"
                        {...field}
                        className="h-32"
                        onPaste={handleImagePaste}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="imageSource"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Image Source</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="upload" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Upload Image
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="url" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Image URL
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("imageSource") === "upload" && (
                <FormField
                  control={form.control}
                  name="imageFile"
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel>Image Upload</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <Input
                            id="imageUpload"
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              handleFileSelect(e);
                              onChange(e.target.files?.[0] || null);
                            }}
                            ref={fileInputRef}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Upload Image
                          </Button>
                          {value && (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={cancelImage}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          )}
                        </div>
                      </FormControl>
                      {previewImage && (
                        <div className="relative mt-2">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="h-auto max-w-full rounded-md"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute right-2 top-2"
                            onClick={cancelImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                      <FormDescription>
                        You can also paste an image directly into the
                        description field.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {form.watch("imageSource") === "url" && (
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
              )}
            </div>
            <div className="space-y-4 md:w-1/2">
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optinal)</FormLabel>
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
                      Type a new tag and press Enter or click "Add Tag" to add
                      it.
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
                    <FormLabel>Live Link (Optinal)</FormLabel>
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
                    <FormLabel>Code Link (Optinal)</FormLabel>
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
            </div>
          </form>
        </Form>
        <DialogFooter className="mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            disabled={isPending || !isDirty}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isPending ? "Adding..." : "Add Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
