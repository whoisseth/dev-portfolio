"use client";

import { useParams } from "next/navigation";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RouteFormSchema } from "@/app/create-portfolio/_components/create-portfolio";
import { z } from "zod";
import { SetStateAction, useState, useTransition } from "react";
import { updateRouteName } from "@/actions/create-portfolio-actions";
import { useToast } from "@/components/ui/use-toast";

import { useRouter } from "next/navigation";
import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { User } from "lucia";

export function SettingsSheet({
  isSettingsOpen,
  setIsSettingsOpen,
  routeName,
  setRouteName,
  user,
}: {
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  routeName: string | undefined;
  setRouteName: React.Dispatch<SetStateAction<string | undefined | null>>;
  user: User;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const currentRoute = params["route-name"] as string;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const routeForm = useForm<z.infer<typeof RouteFormSchema>>({
    resolver: zodResolver(RouteFormSchema),
    defaultValues: {
      routeName: routeName,
    },
  });

  const handleRouteNameUpdate = async (
    data: z.infer<typeof RouteFormSchema>,
  ) => {
    console.log("btn clicked");
    if (data.routeName && routeName !== data.routeName && routeName) {
      startTransition(async () => {
        console.log("inside transition");
        try {
          const result = await updateRouteName(routeName, data.routeName);

          setRouteName(data.routeName);
          setIsSettingsOpen(false);
          toast({
            title: "Route Updated",
            description: `Your route has been updated to /${result.routeName}`,
          });
          router.push(data.routeName);
        } catch (error) {
          console.error("Error updating route name:", error);
          toast({
            title: "Update Failed",
            description:
              error instanceof Error
                ? error.message
                : "An error occurred while updating the route. Please try again.",
            variant: "destructive",
          });
        }
      });
    }
  };

  return (
    <>
      <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="ml-2">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Open settings</span>
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-left">Portfolio Settings</SheetTitle>
          </SheetHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              {/* <Label htmlFor="route-name">Route Name</Label> */}

              {/*  */}
              {/*  */}

              <Form {...routeForm}>
                <form
                  onSubmit={routeForm.handleSubmit(handleRouteNameUpdate)}
                  className="space-y-4"
                >
                  {/* <div>user id: {user?.id}</div> */}
                  <FormField
                    control={routeForm.control}
                    name="routeName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Route Name</FormLabel>
                        <div className="flex flex-col items-center gap-2 lg:flex-row">
                          <FormControl>
                            <Input
                              placeholder={routeName}
                              className="w-full"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            disabled={
                              isPending ||
                              routeForm.getValues("routeName") === routeName
                            }
                            type="submit"
                            className="w-full lg:w-auto"
                          >
                            {isPending ? "Updating..." : "Update"}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </div>

            {/* Add current route and user information */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Current Route:</p>
              <Link
                href={`/${currentRoute}`}
                className="text-blue-500 hover:underline"
              >
                /{currentRoute}
              </Link>
            </div>
            {/* Add user's login route */}
            <div className="space-y-2">
              <p className="text-sm font-medium">Your Route:</p>
              <Link
                // href={`/${user?.username}`}
                href={`/${routeName}`}
                className="text-blue-500 hover:underline"
              >
                {/* /{user?.id} */}/{routeName}
              </Link>
            </div>
          </div>

          {/* Add the logout button here */}
          <div className="flex flex-col gap-4">
            <Link
              prefetch={false}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "mt-4 w-full",
              )}
              href={"/api/sign-out"}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log Out
            </Link>

            <Button
              onClick={() => setIsDeleteDialogOpen(true)}
              variant="destructive"
              className="w-full"
            >
              Delete Account
            </Button>
            <SheetClose asChild>
              <DeleteAccountDialog
                {...{
                  user,
                  isOpen: isDeleteDialogOpen,
                  setIsOpen: setIsDeleteDialogOpen,
                }}
              />
            </SheetClose>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
