"use client"

import React, { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

type NavLink = {
  name: string
  href: string
}

const navLinks: NavLink[] = [
  { name: "About Us", href: "#about-us" },
  { name: "Projects", href: "#projects" },
  { name: "Work Experience", href: "#work-experience" },
  { name: "Resume", href: "#resume" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)

  const NavItems = () => (
    <>
      {navLinks.map((link, i) => (
        <Link
          key={i}
          href={link.href}
          className="text-sm text-muted-foreground hover:text-primary transition-colors"
          onClick={() => setIsOpen(false)}
        >
          {link.name}
        </Link>
      ))}
    </>
  )

  return (
    <div className="sticky top-0 border-b py-4 backdrop-blur-sm bg-background/80">
      <nav className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-semibold">
          DevFolio
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
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
            <div className="flex flex-col gap-6 mt-6">
              <NavItems />
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </div>
  )
}