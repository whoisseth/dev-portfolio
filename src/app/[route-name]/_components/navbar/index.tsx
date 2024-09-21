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
import { UserRoute } from "@/db/schema";

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

export default function Navbar({
  user,
  userRoute,
}: {
  user: UserType | undefined;
  userRoute:
    | {
        routeName: string;
        routeId: number;
        userId: number;
      }
    | null
    | undefined;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [routeName, setRouteName] = useState<string | null | undefined>(
    userRoute?.routeName,
  );

  const [isPortfolioActive, setIsPortfolioActive] = useState(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isUpdateRouteDialogOpen, setIsUpdateRouteDialogOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between">
        {/* <Link href={`/${routeName}`} className="text-2xl font-semibold"> */}
        <Link href={`/`} className="text-2xl font-semibold">
          Portly
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <NavItems setIsOpen={setIsOpen} />
          {user && routeName && (
            // Settings Sheet
            <SettingsSheet
              {...{
                user,
                isPortfolioActive,
                setIsPortfolioActive,
                isSettingsOpen,
                setIsSettingsOpen,
                routeName,
                setIsUpdateRouteDialogOpen,
                setIsDeactivateDialogOpen,
                isDeleteDialogOpen,
                setIsDeleteDialogOpen,
                isUpdateRouteDialogOpen,
                setRouteName,
              }}
            />
          )}
        </div>

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
    </header>
  );
}
