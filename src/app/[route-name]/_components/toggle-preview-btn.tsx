'use client'

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import React from "react";
import { isPreviewAtom } from "../atom";
import { useAtom } from "jotai";

type Props = {
  className?: string;
};

export default function TogglePreviewBtn({ className }: Props) {
  const [isPreview, setIsPreview] = useAtom(isPreviewAtom);

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Switch
        checked={isPreview}
        onCheckedChange={() => setIsPreview(!isPreview)}
        id="airplane-mode"
      />
      <Label htmlFor="airplane-mode">Preview</Label>
    </div>
  );
}
