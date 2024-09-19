"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  FileText,
  Folder,
  Menu,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { User as UserType } from "lucia";
import { cn } from "@/lib/utils";

type NavLink = {
  name: string;
  href: string;
  icon?: ReactNode;
};

const navLinks: NavLink[] = [
  { name: "About Me", href: "#about-me", icon: <User size={20} /> },
  { name: "Projects", href: "#projects", icon: <Folder size={20} /> },
  {
    name: "Work Experience",
    href: "#work-experience",
    icon: <BriefcaseBusiness size={20} />,
  },
  { name: "Resume", href: "/resume", icon: <FileText size={20} /> },
];

// Mock function for updating route name
const updateRouteName = async (routeId: string, newRouteName: string) => {
  // Simulating an API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  console.log(`Route updated: ${routeId} -> ${newRouteName}`);
  return true;
};

export default function Navbar({ user }: { user: UserType | undefined }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [routeName, setRouteName] = useState("utkarsh");
  const [newRouteName, setNewRouteName] = useState("");
  const [isPortfolioActive, setIsPortfolioActive] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isUpdateRouteDialogOpen, setIsUpdateRouteDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleRouteNameUpdate = async () => {
    if (newRouteName && newRouteName !== routeName) {
      const success = await updateRouteName(routeName, newRouteName);
      if (success) {
        setRouteName(newRouteName);
        setNewRouteName("");
        setIsUpdateRouteDialogOpen(false);
        setIsSettingsOpen(false);
        toast({
          title: "Route Updated",
          description: `Your route has been updated to /${newRouteName}`,
        });
      } else {
        toast({
          title: "Update Failed",
          description: "Failed to update the route. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const NavItems = () => (
    <>
      {navLinks.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          onClick={() => setIsOpen(false)}
        >
          <div className="text-sm">{link.icon}</div>
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href={`/${routeName}`} className="text-2xl font-semibold">
          DevFolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <NavItems />
          {user && (
            <Sheet open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="ml-2">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Open settings</span>
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Portfolio Settings</SheetTitle>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="route-name">Route Name</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="route-name"
                        value={newRouteName}
                        onChange={(e) => setNewRouteName(e.target.value)}
                        placeholder={routeName}
                      />
                      <Button
                        onClick={() => setIsUpdateRouteDialogOpen(true)}
                        disabled={!newRouteName || newRouteName === routeName}
                      >
                        Update
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="portfolio-active">Portfolio Active</Label>
                    <Switch
                      id="portfolio-active"
                      checked={isPortfolioActive}
                      onCheckedChange={(checked) => {
                        if (!checked) {
                          setIsDeactivateDialogOpen(true);
                        } else {
                          setIsPortfolioActive(checked);
                        }
                      }}
                    />
                  </div>
                </div>
                <SheetClose asChild>
                  <Dialog
                    open={isDeleteDialogOpen}
                    onOpenChange={setIsDeleteDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="mt-4 w-full">
                        Delete Portfolio
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Are you sure?</DialogTitle>
                        <DialogDescription>
                          This action cannot be undone. This will permanently
                          delete your portfolio.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <Button
                          variant="outline"
                          onClick={() => setIsDeleteDialogOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => {
                            // Add delete logic here
                            console.log("Portfolio deleted");
                            setIsDeleteDialogOpen(false);
                            setIsSettingsOpen(false);
                          }}
                        >
                          Delete
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </SheetClose>
                {/* Add the logout button here */}
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
              </SheetContent>
            </Sheet>
          )}
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] sm:w-[300px]">
            <div className="mt-6 flex flex-col gap-6">
              <NavItems />
              <Button
                variant="outline"
                onClick={() => {
                  setIsOpen(false);
                  setIsSettingsOpen(true);
                }}
              >
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={isDeactivateDialogOpen}
        onOpenChange={setIsDeactivateDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate Portfolio</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate your portfolio? It will no
              longer be visible to visitors.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeactivateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsPortfolioActive(false);
                setIsDeactivateDialogOpen(false);
              }}
            >
              Deactivate
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Update Route Confirmation Dialog */}
      <Dialog
        open={isUpdateRouteDialogOpen}
        onOpenChange={setIsUpdateRouteDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Route Name</DialogTitle>
            <DialogDescription>
              Are you sure you want to update your route from /{routeName} to /
              {newRouteName}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsUpdateRouteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleRouteNameUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </header>
  );
}
