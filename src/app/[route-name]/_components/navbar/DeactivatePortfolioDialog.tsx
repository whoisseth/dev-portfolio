import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";


export function DeactivatePortfolioDialog({
  isDeactivateDialogOpen,
  setIsDeactivateDialogOpen,
  setIsPortfolioActive,
}: {
  isDeactivateDialogOpen: boolean;
  setIsDeactivateDialogOpen: (open: boolean) => void;

  setIsPortfolioActive: (active: boolean) => void;
}) {
  return (
    <Dialog
      open={isDeactivateDialogOpen}
      onOpenChange={setIsDeactivateDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate Portfolio</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate your portfolio? It will no
            longer be visible to visitors.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsDeactivateDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              setIsPortfolioActive(false);
              setIsDeactivateDialogOpen(false);
            }}
          >
            Deactivate
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
