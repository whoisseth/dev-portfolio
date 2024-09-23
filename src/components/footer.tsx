"use client";

import { Github, Twitter, Linkedin } from "lucide-react";
import Link from "next/link";
import { DarkModeToggle } from "./dark-mode-toggle";

export function FooterComponent() {
  return (
    <footer className="bg-background px-4 py-6 md:py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <div className="flex flex-col items-center md:items-start">
          <Link href="/" className="text-xl font-bold text-primary">
            Portly
          </Link>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2024 Portly. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col items-center space-y-4 md:flex-row md:space-x-6 md:space-y-0">
          <nav className="flex space-x-4">
            <Link
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              About
            </Link>
            <Link
              href="#services"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Services
            </Link>
            <Link
              href="#contact"
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              Contact
            </Link>
          </nav>
          <div className="flex space-x-4">
            <Link
              href="https://github.com/whoisseth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Github className="h-5 w-5" />
            </Link>
            <Link
              href="https://x.com/reactdevutkarsh"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Twitter className="h-5 w-5" />
            </Link>
            <Link
              href="https://www.linkedin.com/in/utkarshseth2019/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground transition-colors hover:text-primary"
            >
              <Linkedin className="h-5 w-5" />
            </Link>
          </div>
        </div>
        <DarkModeToggle />
      </div>
    </footer>
  );
}
