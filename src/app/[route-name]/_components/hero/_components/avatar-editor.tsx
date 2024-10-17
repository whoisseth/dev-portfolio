"use client";

import React, { useState, useEffect } from "react";
import { createAvatar } from "@dicebear/core";
import { notionists } from "@dicebear/collection";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { updateAvatarOptions } from "@/actions/hero_actions";
import { User } from "@/lib/session";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Options } from "@dicebear/core";
import { Edit } from "lucide-react";

export type AvatarFeature =
  | "body"
  | "beard"
  | "glasses"
  | "brows"
  | "gesture"
  | "hair"
  | "lips"
  | "nose"
  | "eyes";

export type AvatarOptions = {
  seed: string;
  flip: boolean;
  rotate: number;
  scale: number;
  translateX: number;
  translateY: number;
  beardProbability: number;
  gestureProbability: number;
  glassesProbability: number;
} & {
  [K in AvatarFeature]: string[];
};

const featureOptions: Record<AvatarFeature, string[]> = {
  body: Array.from(
    { length: 25 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  beard: Array.from(
    { length: 12 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  glasses: Array.from(
    { length: 11 },
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
  hair: [
    "hat",
    ...Array.from(
      { length: 63 },
      (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
    ),
  ],
  lips: Array.from(
    { length: 30 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  nose: Array.from(
    { length: 20 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
  eyes: Array.from(
    { length: 5 },
    (_, i) => `variant${String(i + 1).padStart(2, "0")}`,
  ),
};

type Props = {
  className?: string;
  user: User;
  avatarOptions: AvatarOptions;
  setAvatarOptions: (options: AvatarOptions) => void;
  routeName: string;
};

const defaultAvatarOptions: AvatarOptions = {
  seed: "",
  flip: false,
  rotate: 0,
  scale: 100,
  translateX: 0,
  translateY: 0,
  beardProbability: 100,
  gestureProbability: 100,
  glassesProbability: 100,
  body: ["variant01"],
  beard: [],
  glasses: [],
  brows: ["variant01"],
  gesture: [],
  hair: ["variant01"],
  lips: ["variant01"],
  nose: ["variant01"],
  eyes: ["variant01"],
};

export default function AvatarEditor({
  className,
  user,
  avatarOptions,
  setAvatarOptions,
  routeName,
}: Props) {
  const [currentOptions, setCurrentOptions] = useState<AvatarOptions>({
    ...defaultAvatarOptions,
    ...avatarOptions,
  });
  const [currentFeature, setCurrentFeature] = useState<AvatarFeature>("body");
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (!isDialogOpen) {
      // Reset to original values from backend when dialog is closed
      setCurrentOptions({ ...defaultAvatarOptions, ...avatarOptions });
    }
  }, [isDialogOpen, avatarOptions]);

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

  const hasChanges =
    JSON.stringify(currentOptions) !==
    JSON.stringify({
      ...defaultAvatarOptions,
      ...avatarOptions,
    });

  const handleSave = async () => {
    startTransition(async () => {
      try {
        if (user) {
          await updateAvatarOptions(user?.id, currentOptions, routeName);
          setAvatarOptions(currentOptions);
          toast({
            title: "Success",
            description: "Avatar options updated successfully!",
            variant: "default",
          });
          setIsDialogOpen(false);
        }
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

  const handleDialogClose = (isOpen: boolean) => {
    setIsDialogOpen(isOpen);
    if (!isOpen) {
      // Reset to original values when dialog is closed
      setCurrentOptions({ ...defaultAvatarOptions, ...avatarOptions });
    }
  };

  const renderFeatureOptions = (feature: AvatarFeature) => {
    return (
      <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
        {featureOptions[feature].map((variant) => {
          const variantAvatar = createAvatar(notionists, {
            ...currentOptions,
            [feature]: [variant],
          } as Partial<Options>);

          return (
            <Button
              key={variant}
              variant={
                currentOptions[feature][0] === variant ? "default" : "secondary"
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
        })}
      </div>
    );
  };

  const avatar = createAvatar(notionists, currentOptions as Partial<Options>);
  const svg = avatar.toString();

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        <Button
          // size="sm"
          className={cn("hover:border-primary hover:bg-transparent", className)}
          variant="outline"
        >
          <Edit className="mr-2 size-4" />
          Edit Avatar
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[900px]">
        <DialogHeader className="">
          <DialogTitle>Edit your Avatar</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_300px]">
          <div className="order-2 max-h-[60vh] space-y-4 overflow-y-auto rounded-md border p-2 pr-4 md:order-1">
            <AvatarSeedInput
              seed={currentOptions.seed}
              updateOption={updateOption}
            />
            <AvatarFlipSwitch
              flip={currentOptions.flip}
              updateOption={updateOption}
            />
            <AvatarRotateSlider
              rotate={currentOptions.rotate}
              updateOption={updateOption}
            />
            <AvatarScaleSlider
              scale={currentOptions.scale}
              updateOption={updateOption}
            />
            <AvatarProbabilitySlider
              label="Beard Probability"
              value={currentOptions.beardProbability}
              updateOption={(value) => updateOption("beardProbability", value)}
            />
            <AvatarProbabilitySlider
              label="Gesture Probability"
              value={currentOptions.gestureProbability}
              updateOption={(value) =>
                updateOption("gestureProbability", value)
              }
            />
            <AvatarProbabilitySlider
              label="Glasses Probability"
              value={currentOptions.glassesProbability}
              updateOption={(value) =>
                updateOption("glassesProbability", value)
              }
            />
            <AvatarFeatureSelector
              currentFeature={currentFeature}
              setCurrentFeature={setCurrentFeature}
            />
            {renderFeatureOptions(currentFeature)}
          </div>
          <AvatarPreview className="order-1 md:order-2" svg={svg} />
        </div>
        <DialogFooter className="flex flex-col gap-2">
          <Button
            onClick={() => setIsDialogOpen(false)}
            className=""
            variant="outline"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className=""
            variant="default"
            disabled={!hasChanges || isPending}
          >
            {isPending ? "Saving..." : "Save Avatar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AvatarSeedInput({
  seed,
  updateOption,
}: {
  seed: string;
  updateOption: (key: "seed", value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor="seed">Seed</Label>
      <Input
        id="seed"
        value={seed}
        onChange={(e) => updateOption("seed", e.target.value)}
      />
    </div>
  );
}

function AvatarFlipSwitch({
  flip,
  updateOption,
}: {
  flip: boolean;
  updateOption: (key: "flip", value: boolean) => void;
}) {
  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="flip"
        checked={flip}
        onCheckedChange={(checked) => updateOption("flip", checked)}
      />
      <Label htmlFor="flip">Flip</Label>
    </div>
  );
}

function AvatarRotateSlider({
  rotate,
  updateOption,
}: {
  rotate: number;
  updateOption: (key: "rotate", value: number) => void;
}) {
  return (
    <div>
      <Label htmlFor="rotate">Rotate</Label>
      <Slider
        id="rotate"
        min={0}
        max={360}
        step={1}
        value={[rotate]}
        onValueChange={(value) => updateOption("rotate", value[0])}
      />
    </div>
  );
}

function AvatarScaleSlider({
  scale,
  updateOption,
}: {
  scale: number;
  updateOption: (key: "scale", value: number) => void;
}) {
  return (
    <div>
      <Label htmlFor="scale">Scale</Label>
      <Slider
        id="scale"
        min={0}
        max={200}
        step={1}
        value={[scale]}
        onValueChange={(value) => updateOption("scale", value[0])}
      />
    </div>
  );
}

function AvatarProbabilitySlider({
  label,
  value,
  updateOption,
}: {
  label: string;
  value: number;
  updateOption: (value: number) => void;
}) {
  return (
    <div>
      <Label htmlFor={label}>{label}</Label>
      <Slider
        id={label}
        min={0}
        max={100}
        step={1}
        value={[value]}
        onValueChange={(value) => updateOption(value[0])}
      />
    </div>
  );
}

function AvatarFeatureSelector({
  currentFeature,
  setCurrentFeature,
}: {
  currentFeature: AvatarFeature;
  setCurrentFeature: (feature: AvatarFeature) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {(Object.keys(featureOptions) as AvatarFeature[]).map((feature) => (
        <Button
          key={feature}
          className="capitalize"
          variant={currentFeature === feature ? "default" : "outline"}
          onClick={() => setCurrentFeature(feature)}
        >
          {feature}
        </Button>
      ))}
    </div>
  );
}

function AvatarPreview({
  className,
  svg,
}: {
  className?: string;
  svg: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border bg-muted p-4",
        className,
      )}
    >
      <div
        className="aspect-square w-full"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </div>
  );
}
