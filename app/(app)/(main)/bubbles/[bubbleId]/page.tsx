"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { use } from "react";

export default function BubblePage({
  params,
}: {
  params: { bubbleId: string };
}) {
  const { bubbleId } = use(params as unknown as Promise<{ bubbleId: string }>);
  const currentBubble = useQuery(api.bubbles.getBubbleName, {
    bubbleSlug: bubbleId,
  });
  return (
    <>
      <div className="flex w-full justify-center items-center gap-2">
        <img src={currentBubble?.iconUrl} width={30} height={30} />
        <h1 className="font-bold">{currentBubble?.name}</h1>
      </div>
      <div className="w-full h-full border-2"></div>
      <div className="w-full border-2 mt-auto">
        <div className="flex">
          <Input />
          <Button>Post</Button>
        </div>
        {/* Additional content can be added here */}
      </div>
    </>
  );
}
