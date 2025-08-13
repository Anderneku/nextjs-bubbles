import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreatePostForm } from "../forms/createPost";

export function CreatePostDialog({
  open,
  onCancel,
  bubbleId,
}: {
  open: boolean;
  onCancel: () => void;
  bubbleId: string;
}) {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        open == false && onCancel();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Create a Post</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you&apos;re done.
        </DialogDescription>
        <CreatePostForm closeDialog={onCancel} bubbleId={bubbleId} />
      </DialogContent>
    </Dialog>
  );
}
