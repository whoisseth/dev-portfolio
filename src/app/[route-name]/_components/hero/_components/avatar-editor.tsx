"use client";

import React, { useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateAvatarOptions } from "@/actions/create-portfolio-actions";
import { User } from "lucia";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { FilePen } from "lucide-react";
import { cn } from "@/lib/utils";
import { Options } from "@dicebear/core";

export type AvatarOptions = {
  seed: string;
  flip: boolean;
  scale: number;
  body: string[];
  brows: string[];
  gesture: string[];
  hair: string[];
  lips: string[];
  nose: string[];
};

const featureOptions = {
  body: Array.from(
    { length: 25 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  brows: Array.from(
    { length: 13 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  gesture: [
    "hand",
    "handPhone",
    "ok",
    "okLongArm",
    "point",
    "pointLongArm",
    "waveLongArm",
    "waveLongArms",
    "waveOkLongArms",
    "wavePointLongArms",
  ],
  hair: Array.from(
    { length: 63 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  lips: Array.from(
    { length: 30 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  nose: Array.from(
    { length: 13 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
};

type Props = {
  className?: string;
  user: User;
  avatarOptions: AvatarOptions;
  setAvatarOptions: (options: AvatarOptions) => void;
};

export default function AvatarEditor({
  className,
  user,
  avatarOptions,
  setAvatarOptions,
}: Props) {
  // const [options, setOptions] = useAtom(avatarOptionsAtom);
  const [currentOptions, setCurrentOptions] = useState(avatarOptions);
  const [currentFeature, setCurrentFeature] =
    useState<keyof AvatarOptions>("body");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setCurrentOptions(avatarOptions);
  }, [avatarOptions]);

  const updateOption = (
    key: keyof AvatarOptions,
    value: string | number | boolean | string[],
  ) => {
    setCurrentOptions((prev) => ({
      ...prev,
      [key]:
        typeof value === "boolean"
          ? value
          : Array.isArray(value)
            ? value
            : [value],
    }));
  };

  const handleSave = async () => {
    startTransition(async () => {
      try {
        await updateAvatarOptions(user.id, currentOptions);
        setAvatarOptions(currentOptions);
        toast({
          title: "Success",
          description: "Avatar options updated successfully!",
          variant: "default",
        });
        setIsDialogOpen(false); // Close the dialog after saving
      } catch (error) {
        console.error("Error updating avatar options:", error);
        toast({
          title: "Error",
          description: `Failed to update avatar options. Please try again. - ${error}`,
          variant: "destructive",
        });
      }
    });
  };

  const renderFeatureOptions = (feature: keyof AvatarOptions) => {
    return (
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {featureOptions[feature as keyof typeof featureOptions].map(
          (variant) => {
            const variantAvatar = createAvatar(notionists, {
              ...currentOptions,
              [feature]: [
                variant as
                  | "variant25"
                  | "variant24"
                  | "variant23"
                  | "variant22"
                  | "variant21"
                  | "variant20"
                  | "variant19"
                  | "variant18"
                  | "variant17"
                  | "variant16"
                  | "variant15"
                  | "variant14"
                  | "variant13"
                  | "variant12"
                  | "variant11"
                  | "variant10"
                  | "variant09"
                  | "variant08"
                  | "variant07"
                  | "variant06"
                  | "variant05"
                  | "variant04"
                  | "variant03"
                  | "variant02"
                  | "variant01",
              ],
            } as Partial<Options & Options>);
            return (
              <Button
                key={variant}
                variant={
                  Array.isArray(currentOptions[feature]) &&
                  (currentOptions[feature] as any[])[0] === variant
                    ? "default"
                    : "secondary"
                }
                className="h-auto w-auto p-0"
                onClick={() => updateOption(feature, [variant])}
              >
                <div
                  className="aspect-square w-full"
                  dangerouslySetInnerHTML={{ __html: variantAvatar.toString() }}
                />
              </Button>
            );
          },
        )}
      </div>
    );
  };

  const avatar = createAvatar(
    notionists,
    currentOptions as Partial<Options & Options>,
  );
  const svg = avatar.toString();

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          className={cn("hover:border-primary hover:bg-transparent", className)}
          variant="outline"
        >
          <FilePen size={16} className="mr-2" /> Edit Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Edit your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-1 pr-4">
            <div>
              <Label htmlFor="seed">Seed</Label>
              <Input
                id="seed"
                value={currentOptions.seed}
                onChange={(e) => updateOption("seed", e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="flip"
                checked={currentOptions.flip}
                onCheckedChange={(checked) => updateOption("flip", checked)}
              />
              <Label htmlFor="flip">Flip</Label>
            </div>
            <div>
              <Label htmlFor="scale">Scale</Label>
              <Slider
                id="scale"
                min={0}
                max={200}
                step={1}
                value={[currentOptions.scale]}
                onValueChange={(value) => updateOption("scale", value[0])}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(featureOptions).map((feature) => (
                <Button
                  key={feature}
                  className="capitalize"
                  variant={currentFeature === feature ? "default" : "outline"}
                  onClick={() =>
                    setCurrentFeature(feature as keyof AvatarOptions)
                  }
                >
                  {feature}
                </Button>
              ))}
            </div>
            {renderFeatureOptions(currentFeature)}
            <Button onClick={handleSave} className="mt-4" variant="default">
              {isPending ? "Saving..." : "Save Avatar"}
            </Button>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted p-4">
            <div
              className="aspect-square w-full"
              dangerouslySetInnerHTML={{ __html: svg }}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
