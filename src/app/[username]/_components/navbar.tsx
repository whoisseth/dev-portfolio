"use client";

import React, { ReactNode, useState } from "react";
import Link from "next/link";
import {
  BriefcaseBusiness,
  FileText,
  Folder,
  Menu,
  User,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavLink = {
  name: string;
  href: string;
  icon?: ReactNode;
};

const navLinks: NavLink[] = [
  { name: "About Us", href: "#about-us", icon: <User size={20} /> },
  { name: "Projects", href: "#projects", icon: <Folder size={20} /> },
  {
    name: "Work Experience",
    href: "#work-experience",
    icon: <BriefcaseBusiness size={20}/>,
  },
  { name: "Resume", href: "#resume", icon: <FileText size={20} /> },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const NavItems = () => (
    <>
      {navLinks.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          onClick={() => setIsOpen(false)}
        >
          <div className="text-sm ">{link.icon}</div>
          <p>{link.name}</p>
        </Link>
      ))}
    </>
  );

  return (
    <div className="sticky top-0 border-b bg-background/80 py-4 backdrop-blur-sm">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">
          DevFolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden items-center gap-6 md:flex">
          <NavItems />
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
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  );
}
