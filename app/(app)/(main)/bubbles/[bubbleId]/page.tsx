"use client";
import { Button } from "@/components/ui/button";

import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
import { use, useEffect, useRef, useState } from "react";
import { CreatePostDialog } from "@/components/dialogs/createPostDialog";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import BubblePost from "@/components/BubblePage";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

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
  const getUsersInBubble = useQuery(api.bubbles.getAllBubbleMembers, {
    bubbleId:  currentBubble?._id as string,
  })
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
      <div className="sticky bg-sidebar text-secondary border-b-2 z-50 p-4 top-0 flex w-full justify-center items-center ">
        <div className="flex items-center gap-2">
          <img src={currentBubble?.iconUrl} width={40} height={40} />
          <h1 className="font-bold text-2xl">{currentBubble?.name}</h1>
        </div>
        <div className="absolute right-8">

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Members List</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-2">
            <div className="flex flex-col w-full h-8">
              {getUsersInBubble?.map((user, index) => (
                <div key={index} className="flex w-full h-full gap-2 items-center">
                  <img src={user?.avatarUrl} width={32} height={32} className="object-cover rounded-full"/>
                  <p>{user?.name}</p>
                  <p className="ml-auto">{index+1}</p>
                </div>
              ))}
            </div>
          </PopoverContent>
        </Popover>
        </div>
      </div>

      <div className="w-full   h-full  flex flex-col items-center gap-4 p-4">
        {posts.map((post, index) => (
          <BubblePost formattedTime={formattedTime} post={post} key={index} />
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
