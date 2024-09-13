"use client";

import { useState } from "react";
import { Eye, Pencil } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type ModeToggleComponentProps = {
  className?: string;
};

export function ModeToggleComponent(props: ModeToggleComponentProps) {
  const [mode, setMode] = useState<"preview" | "edit">("preview");

  return (
    <div className={cn(props.className)}>
      <div className="relative bg-background inline-flex overflow-hidden rounded-md border">
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => setMode("preview")}
          className={`relative z-10 flex w-28 items-center justify-center px-4 py-2 transition-colors duration-200 ${
            mode === "preview" ? "text-secondary" : "text-primary"
          } `}
          aria-label="Preview mode"
        >
          <Eye className="mr-2 h-4 w-4" />
          Preview
        </Button>
        <Button
          size={"sm"}
          variant={"ghost"}
          onClick={() => setMode("edit")}
          className={`relative z-10 flex w-28 items-center justify-center px-4 py-2 transition-colors duration-200 ${
            mode === "edit" ? "text-secondary" : "text-primary"
          }`}
          aria-label="Edit mode"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <div
          className={`absolute top-0 h-full w-28 rounded-md bg-primary transition-transform duration-200 ease-in-out ${
            mode === "preview" ? "translate-x-0" : "translate-x-full"
          }`}
        />
      </div>
    </div>
  );
}
