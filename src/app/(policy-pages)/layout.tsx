import Link from "next/link";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function PolicyLayout({ children }: Props) {
  return (
    <div>
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <nav className="container mx-auto flex items-center justify-between">
          <Link href={`/`} className="text-2xl font-semibold">
            Portly
          </Link>
          <Link
            href={`/`}
            className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            Back to home
          </Link>
        </nav>
      </header>
      <div>{children}</div>
    </div>
  );
}
