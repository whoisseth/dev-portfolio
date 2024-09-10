"use client";

import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  addAboutMe,
  addRoute,
  checkRouteAvailability,
} from "@/actions/create-portfolio-actions";
import { User } from "lucia";

const FormSchema = z.object({
  routeName: z
    .string()
    .min(2, { message: "Route name must be at least 2 characters." }),
  fullName: z.string().min(2, { message: "Full name is required." }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  skills: z.string().optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, { message: "Invalid phone number format." })
    .optional(),
  linkedin: z.string().url({ message: "Invalid LinkedIn URL." }).optional(),
  github: z.string().url({ message: "Invalid GitHub URL." }).optional(),
});

export function CreatePortfolio({ user }: { user: User | undefined }) {
  const [routeValue, setRouteValue] = useState("");
  const [isRouteAssigned, setIsRouteAssigned] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      fullName: "",
      routeName: "",
      description: "",
      email: "",
      // skills: "",
      // phone: "",
      // linkedin: "",
      // github: "",
    },
  });

  useEffect(() => {
    console.log("Component mounted");
  }, []);

  const handleRouteAvailability = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    if (routeValue.length < 3) {
      toast({
        title: "Invalid route name",
        description: "Route name must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    console.log("Check availability clicked", routeValue);
    setIsChecking(true);

    try {
      const isAvailable = await checkRouteAvailability(routeValue);
      console.log("isAvailable", isAvailable);

      if (!isAvailable) {
        toast({
          title: "Route is not available",
          description: "Please try a different route name.",
          variant: "destructive",
        });
      } else {
        setIsRouteAssigned(true);
        form.setValue("routeName", routeValue);
      }
    } catch (error) {
      console.error("Error checking route availability:", error);
      toast({
        title: "Error",
        description: "Failed to check route availability. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsChecking(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    console.log("Form submitted", data);

    try {
      const [{ id: routeId }] = await addRoute(routeValue);

      const portfolioData = {
        ...data,
        userId: user?.id,
      };

      // Here you would typically have an API call to create the portfolio

      const aboutMeData = {
        ...data,
        skills: data.skills || null,
        github: data.github || null,
        phoneNumber: data.phone || null,
        linkedIn: data.linkedin || null,
        userId: user?.id || 0,
        routeId: routeId,
      };

      await addAboutMe(aboutMeData);
      console.log("Portfolio data prepared:", portfolioData);

      toast({
        title: "Portfolio created!",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white">
              {JSON.stringify(portfolioData, null, 2)}
            </code>
          </pre>
        ),
      });
    } catch (error) {
      console.error("Error creating portfolio:", error);
      toast({
        title: "Error",
        description: "Failed to create portfolio. Please try again.",
        variant: "destructive",
      });
    }
  };

  console.log("Rendering component, isRouteAssigned:", isRouteAssigned);

  if (!isRouteAssigned) {
    return (
      <div className="mx-auto flex min-h-screen w-full max-w-2xl items-center justify-center p-6">
        <form onSubmit={handleRouteAvailability} className="w-full max-w-lg">
          <div>user id: {user?.id}</div>
          <div className="flex w-full flex-col gap-2 sm:flex-row">
            <Input
              value={routeValue}
              onChange={(e) => setRouteValue(e.target.value)}
              placeholder="your-unique-route"
              className="w-full"
            />
            <Button
              type="submit"
              className="whitespace-nowrap"
              disabled={isChecking}
            >
              {isChecking ? "Checking..." : "Check Availability"}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-2xl font-bold">Create Portfolio</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Form fields */}
          <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input placeholder="John Doe" {...field} />
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
                    placeholder="A brief description of yourself"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="skills"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="JavaScript, React, Node.js" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone (optional)</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="+1234567890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkedin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>LinkedIn URL (optional)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="https://www.linkedin.com/in/johndoe"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="github"
            render={({ field }) => (
              <FormItem>
                <FormLabel>GitHub URL (optional)</FormLabel>
                <FormControl>
                  <Input placeholder="https://github.com/johndoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Create Portfolio
          </Button>
        </form>
      </Form>
    </div>
  );
}
