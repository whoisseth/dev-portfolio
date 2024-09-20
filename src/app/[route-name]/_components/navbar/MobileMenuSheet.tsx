import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {} from "@/components/ui/switch";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavItems } from "./NavItems";

export function MobileMenuSheet({
  isOpen,
  setIsOpen,
  setIsSettingsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  setIsSettingsOpen: (open: boolean) => void;
}) {
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[240px] sm:w-[300px]">
        <div className="mt-6 flex flex-col gap-6">
          <NavItems setIsOpen={setIsOpen} />
          <Button
            variant="outline"
            onClick={() => {
              setIsOpen(false);
              setIsSettingsOpen(true);
            }}
          >
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
