import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function UpdateRouteDialog({
  isUpdateRouteDialogOpen,
  setIsUpdateRouteDialogOpen,
  handleRouteNameUpdate,
  routeName,
  newRouteName,
}: {
  isUpdateRouteDialogOpen: boolean;
  setIsUpdateRouteDialogOpen: (open: boolean) => void;
  handleRouteNameUpdate: () => void;
  routeName: string | undefined;
  newRouteName: string;
}) {
  return (
    <Dialog
      open={isUpdateRouteDialogOpen}
      onOpenChange={setIsUpdateRouteDialogOpen}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Route Name</DialogTitle>
          <DialogDescription>
            Are you sure you want to update your route from /{routeName} to /
            {newRouteName}?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setIsUpdateRouteDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleRouteNameUpdate}>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
