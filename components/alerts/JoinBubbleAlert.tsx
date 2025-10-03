"use client";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertDialogHeader, AlertDialogFooter } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";

export default function JoinBubbleAlert({
  open,
  setOpen,
  userId,
  bubbleId,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  userId: string;
  bubbleId: string;
}) {
  const joinBubble = useMutation(api.bubbles.joinBubble);

  async function userJoinBubble() {
    const join = await joinBubble({
      bubbleId: bubbleId,
      userId: userId,
    });
    if (join == true) {
      toast.error("You are already a member of this bubble!");
    }
  }
  return (
    <AlertDialog open={open} onOpenChange={() => setOpen(!open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Join this Bubble?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to join this bubble?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={userJoinBubble}>Join</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
