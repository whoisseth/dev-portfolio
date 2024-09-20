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

import Link from "next/link";
import { cn } from "@/lib/utils";

export function SettingsSheet({
  isPortfolioActive,
  setIsPortfolioActive,
  isSettingsOpen,
  setIsSettingsOpen,
  routeName,
  newRouteName,
  setNewRouteName,
  setIsUpdateRouteDialogOpen,
  setIsDeactivateDialogOpen,
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
}: {
  isPortfolioActive: boolean;
  setIsPortfolioActive: (active: boolean) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  routeName: string;
  newRouteName: string;
  setNewRouteName: (name: string) => void;
  setIsUpdateRouteDialogOpen: (open: boolean) => void;
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (open: boolean) => void;
  setIsDeactivateDialogOpen: (open: boolean) => void;
}) {
  return (
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
                  This action cannot be undone. This will permanently delete
                  your portfolio.
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
          className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")}
          href={"/api/sign-out"}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Log Out
        </Link>
      </SheetContent>
    </Sheet>
  );
}
