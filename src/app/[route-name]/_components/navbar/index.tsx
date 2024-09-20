"use client";

import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import { User as UserType } from "lucia";
import { BriefcaseBusiness, FileText, Folder, User } from "lucide-react";
import { NavItems, NavLink } from "./NavItems";
import Link from "next/link";
import { SettingsSheet } from "./SettingsSheet";
import { MobileMenuSheet } from "./MobileMenuSheet";
import { DeactivatePortfolioDialog } from "./DeactivatePortfolioDialog";
import { UpdateRouteDialog } from "./UpdateRouteDialog";

export const navLinks: NavLink[] = [
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

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href={`/${routeName}`} className="text-2xl font-semibold">
          DevFolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <NavItems setIsOpen={setIsOpen} />
          {user && (
            // Settings Sheet
            <SettingsSheet
              {...{
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
              }}
            />
          )}
        </div>

        {/* Mobile Menu */}
        {/* Sheet for Mobile Menu */}
        <MobileMenuSheet {...{ isOpen, setIsOpen, setIsSettingsOpen }} />
      </nav>

      {/* Deactivate Confirmation Dialog */}
      <DeactivatePortfolioDialog
        {...{
          isDeactivateDialogOpen,
          setIsDeactivateDialogOpen,
          setIsPortfolioActive,
        }}
      />

      {/* Update Route Confirmation Dialog */}
      <UpdateRouteDialog
        {...{
          isUpdateRouteDialogOpen,
          setIsUpdateRouteDialogOpen,
          handleRouteNameUpdate,
          routeName,
          newRouteName,
        }}
      />
    </header>
  );
}
