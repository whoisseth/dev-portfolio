"use client";

import { useState, useTransition, useRef, useCallback, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { db } from "@/db";

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
import { X, Upload, Trash2, Link } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Project } from "@/db/schema";
import { optimizeImage } from "@/lib/utils";

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
  tags: z.array(z.string()).max(8, "Maximum of 8 tags allowed").default([]),
  liveLink: z.string().url("Invalid URL").optional().or(z.literal("")),
  codeLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export type ProjectFormValues = z.infer<typeof projectSchema>;

type Props = {
  project: Project & { id: number };
  children?: React.ReactNode;
  userRoute: {
    routeName: string;
    routeId: number;
    userId: number;
  };
};

export function UpdateProjectDialogComponent({
  userRoute,
  project,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [isOptimizing, startOptimizing] = useTransition();
  const { toast } = useToast();
  const tagInputRef = useRef<HTMLInputElement>(null);
  const [previewImage, setPreviewImage] = useState<string | null | undefined>(
    project.imageUrl || null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isImageUpdated, setIsImageUpdated] = useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: project.title,
      description: project.description,
      imageSource: "upload",
      imageUrl: project.imageUrl || "",
      tags: project.tags,
      liveLink: project.liveLink || "",
      codeLink: project.codeLink || "",
    },
  });

  const { isDirty } = form.formState;

  const resetForm = useCallback(() => {
    form.reset({
      title: project.title,
      description: project.description,
      imageSource: project.imageUrl ? "url" : "upload",
      imageUrl: project.imageUrl || "",
      tags: project.tags,
      liveLink: project.liveLink || "",
      codeLink: project.codeLink || "",
    });
    setPreviewImage(project.imageUrl || null);
    setIsImageUpdated(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [project, form]);

  const handleCancel = () => {
    resetForm();
    setOpen(false);
  };

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  async function onSubmit(data: ProjectFormValues) {
    startTransition(async () => {
      try {
        let imageUrl = data.imageUrl;
        if (data.imageSource === "upload" && data.imageFile) {
          const formData = new FormData();
          formData.append("image", data.imageFile);
          formData.append("routeId", userRoute.routeId.toString());
          formData.append("userId", userRoute.userId.toString());
          formData.append("projectId", project.id.toString());
          const res = await fetch("/api/upload-image", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            throw new Error("Image upload failed");
          }

          const uploadResult = await res.json();
          imageUrl = uploadResult.imageUrl;

          // Delete the old image if it exists
          if (project.imageUrl) {
            await fetch("/api/delete-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: project.imageUrl }),
            });
          }
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
          id: project.id,
        };

        await updateProject(project.id, projectData);

        toast({
          title: "Success",
          description: "Project updated successfully!",
          variant: "default",
        });

        setOpen(false);
        form.reset(data);
        setPreviewImage(imageUrl);
      } catch (error) {
        console.error("Error updating project:", error);
        toast({
          title: "Error",
          description: `Failed to update project. Please try again.- ${error}`,
          variant: "destructive",
        });
      }
    });
  }

  const addTag = (tags: string[], onChange: (value: string[]) => void) => {
    const newTag = tagInputRef.current?.value.trim();
    if (newTag && !tags.includes(newTag) && tags.length < 8) {
      onChange([...tags, newTag]);
      if (tagInputRef.current) {
        tagInputRef.current.value = "";
      }
    }
  };

  const handleImageChange = async (file: File) => {
    startOptimizing(async () => {
      if (file) {
        try {
          let optimizedFile = file;
          if (file.size > MAX_FILE_SIZE) {
            optimizedFile = await optimizeImage(file, MAX_FILE_SIZE);
          }
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreviewImage(reader.result as string);
          };
          reader.readAsDataURL(optimizedFile);
          form.setValue("imageFile", optimizedFile);
          setIsImageUpdated(true);
        } catch (error) {
          console.error("Error optimizing image:", error);
          toast({
            title: "Error",
            description:
              "Failed to optimize image. Please try a different image.",
            variant: "destructive",
          });
        }
      }
    });
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleImageChange(file);
    }
  };

  const handleImagePaste = useCallback(async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (items) {
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image") !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            await handleImageChange(file);
          }
          break;
        }
      }
    }
  }, []);

  const handleImageChange_old = (file: File) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("imageFile", file);
      setIsImageUpdated(true);
    }
  };

  const handleFileSelect_old = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleImagePaste_old = useCallback((e: React.ClipboardEvent) => {
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
    form.setValue("imageUrl", "");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setIsImageUpdated(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button variant="outline" size="sm" className="flex-1">
            Edit
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] md:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Update Project</DialogTitle>
          <DialogDescription>
            Update the details of your existing project. Click update when
            you're done.
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
              <FormField
                control={form.control}
                name="tags"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tags (Optinal) </FormLabel>
                    <FormControl>
                      <Controller
                        name="tags"
                        control={form.control}
                        render={({ field: { onChange, value } }) => (
                          <div>
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
                                disabled={value.length >= 8}
                              />
                              <Button
                                type="button"
                                onClick={() => addTag(value, onChange)}
                                className="ml-2"
                                disabled={value.length >= 8}
                              >
                                Add Tag
                              </Button>
                            </div>
                            <div className="mt-2 flex flex-wrap gap-2">
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
                          </div>
                        )}
                      />
                    </FormControl>
                    <FormDescription>
                      Type a new tag and press Enter or click "Add Tag" to add
                      it. Maximum of 8 tags allowed.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter className="mt-6 flex flex-col gap-2">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            disabled={isPending || (!isDirty && !isImageUpdated)}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isOptimizing ? (
              <p>Optimizing image...</p>
            ) : isPending ? (
              "Updating..."
            ) : (
              "Update Project"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
