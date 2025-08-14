"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { use, useEffect, useRef, useState } from "react";
import { CreatePostDialog } from "@/components/dialogs/createPostDialog";
import { ChevronsUpDown, Heart, MessageSquareIcon, Plus } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@radix-ui/react-collapsible";
import { Input } from "@/components/ui/input";
import BubblePost from "@/components/BubblePage";

export default function BubblePage({
  params,
}: {
  params: { bubbleId: string };
}) {
  const { bubbleId } = use(params as unknown as Promise<{ bubbleId: string }>);
  const currentBubble = useQuery(api.bubbles.getBubbleName, {
    bubbleSlug: bubbleId,
  });
  const {
    results: posts,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.posts.getPosts,
    { bubbleId: currentBubble?._id as string },
    { initialNumItems: 10 }
  );
  // const getPosts = useQuery(api.posts.getPosts, {
  //   bubbleId: currentBubble?._id as string,
  // });

  const loadMoreRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && status === "CanLoadMore") {
          loadMore(10);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [status, loadMore]);

  const [open, setOpen] = useState(false);

  function formattedTime(timestamp: number) {
    const date = new Date(timestamp);
    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    });
    return formattedTime;
  }
  return (
    <>
      <div className="sticky bg-sidebar text-secondary border-b-2 z-50 p-4 top-0 flex w-full justify-center items-center gap-2 ">
        <img src={currentBubble?.iconUrl} width={40} height={40} />
        <h1 className="font-bold text-2xl">{currentBubble?.name}</h1>
      </div>
      <div className="w-full   h-full  flex flex-col items-center gap-4 p-4">
        {posts.map((post, index) => (
          <BubblePost formattedTime={formattedTime} post={post} key={index}  />
        ))}
        <div ref={loadMoreRef} />
      </div>
      <div className="fixed  z-50 w-16 h-16 bottom-8 right-2 ">
        <Button
          className="w-full h-full rounded-full"
          onClick={() => setOpen(true)}
        >
          <Plus className="size-8" />
        </Button>
        <CreatePostDialog
          open={open}
          onCancel={() => setOpen(false)}
          bubbleId={currentBubble?._id as string}
        />
      </div>
    </>
  );
}
