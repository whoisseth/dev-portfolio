"use client";

import { useState, useTransition, useCallback } from "react";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { updateWorkExperience } from "@/actions/workExperience-actions";
import { useToast } from "@/components/ui/use-toast";
import { WorkExperience } from "@/db/schema";

const workExperienceSchema = z.object({
  jobTitle: z.string().min(3, "Job title is required"),
  companyName: z.string().min(3, "Company name is required"),
  location: z.string().min(3, "Location is required"),
  startDate: z.string().min(3, "Start date is required"),
  endDate: z.string().optional(),
  isPresent: z.boolean(),
  jobDescription: z.string().min(10, "Job description is required"),
});

type WorkExperienceFormValues = z.infer<typeof workExperienceSchema>;

type Props = {
  workExperience: WorkExperience;
  userRoute: {
    routeName: string;
    routeId: number;
    userId: number;
  };
};

export function UpdateWorkExperienceDialogComponent({
  userRoute,
  workExperience,
}: Props) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<WorkExperienceFormValues>({
    resolver: zodResolver(workExperienceSchema),
    defaultValues: {
      jobTitle: workExperience.jobTitle,
      companyName: workExperience.companyName,
      location: workExperience.location,
      startDate: workExperience.startDate,
      endDate: workExperience.endDate ?? undefined,
      isPresent: workExperience.isPresent,
      jobDescription: workExperience.jobDescription,
    },
  });

  const { isDirty } = form.formState;
  const isPresent = form.watch("isPresent");

  async function onSubmit(data: WorkExperienceFormValues) {
    startTransition(async () => {
      try {
        await updateWorkExperience(
          {
            ...data,
            userId: userRoute.userId,
            routeId: userRoute.routeId,
            id: workExperience.id,
          },
          userRoute.routeName,
        );

        toast({
          title: "Success",
          description: "Work experience updated successfully!",
          variant: "default",
        });

        setOpen(false);
        form.reset(data);
      } catch (error) {
        console.error("Error updating work experience:", error);
        toast({
          title: "Error",
          description: `Failed to update work experience. Please try again.`,
          variant: "destructive",
        });
      }
    });
  }

  const resetForm = useCallback(() => {
    form.reset({
      jobTitle: workExperience.jobTitle,
      companyName: workExperience.companyName,
      location: workExperience.location,
      startDate: workExperience.startDate,
      endDate: workExperience.endDate ?? undefined,
      isPresent: workExperience.isPresent,
      jobDescription: workExperience.jobDescription,
    });
  }, [workExperience, form]);

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      resetForm();
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[90vw] md:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Update Work Experience</DialogTitle>
          <DialogDescription>
            Update the details of your existing work experience. Click update
            when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 md:flex md:gap-6 md:space-y-0"
          >
            <div className="space-y-4 md:w-1/2">
              <FormField
                control={form.control}
                name="jobTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Job Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Company Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="Location" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Start Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>End Date</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          disabled={isPresent}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="isPresent"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>I currently work here</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-4 md:w-1/2">
              <FormField
                control={form.control}
                name="jobDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your responsibilities and achievements"
                        className="h-[200px]"
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
        <DialogFooter className="mt-6 flex flex-col gap-2">
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
            {isPending ? "Updating..." : "Update Work Experience"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
