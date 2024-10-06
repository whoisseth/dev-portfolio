// "use client";

import UserNavigation from "@/components/user-navigation";
import Link from "next/link";

export default function SupportUsNavbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-semibold">
          Portly
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Home
          </Link>

          {/* <UserNavigation /> */}
        </div>
      </nav>
    </header>
  );
}
