import { Loader2, Trash2, TriangleAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type DeleteConfirmDialogProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  itemName: string;
};

export function DeleteConfirmDialog({ open, onClose, onConfirm, loading, itemName }: DeleteConfirmDialogProps) {
  return (
    <Dialog onOpenChange={(nextOpen) => !nextOpen && onClose()} open={open}>
      <DialogContent className="max-w-md rounded-xl">
        <DialogHeader>
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
            <TriangleAlert className="h-6 w-6 text-destructive" />
          </div>
          <DialogTitle className="text-center text-lg">Konfirmasi Hapus</DialogTitle>
          <DialogDescription className="text-center">
            Anda akan menghapus <span className="font-semibold text-foreground">{itemName}</span>. Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:justify-center">
          <Button className="rounded-lg" onClick={onClose} type="button" variant="outline">
            Batal
          </Button>
          <Button className="gap-2 rounded-lg" disabled={loading} onClick={onConfirm} type="button" variant="destructive">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
