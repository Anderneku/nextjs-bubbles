"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { use, useRef } from "react";

export default function BubblePage({
  params,
}: {
  params: { bubbleId: string };
}) {
  const { user } = useUser();
  const { bubbleId } = use(params as unknown as Promise<{ bubbleId: string }>);
  const currentBubble = useQuery(api.bubbles.getBubbleName, {
    bubbleSlug: bubbleId,
  });
  const sendPost = useMutation(api.posts.postMessage);
  const getPosts = useQuery(api.posts.getPosts, {
    bubbleId: currentBubble?._id as string,
  });

  const postInputRef = useRef<HTMLInputElement>(null);

  function sendPostMessage(e: any) {
    e.preventDefault();
    if (!postInputRef.current || postInputRef.current?.value.trim() == "")
      return;
    const postBody = postInputRef.current?.value;
    if (user) {
      sendPost({
        authorId: user.id,
        bubbleId: currentBubble?._id as string,
        body: postBody as string,
      });
      postInputRef.current.value = ""; // Clear input after sending
    }
  }

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
      <div className="flex w-full justify-center items-center gap-2">
        <img src={currentBubble?.iconUrl} width={30} height={30} />
        <h1 className="font-bold">{currentBubble?.name}</h1>
      </div>
      <div className="w-full h-full border-2 flex flex-col gap-2 p-4">
        {getPosts?.map((post, index) => (
          <div key={index} className="bg-primary text-primary-foreground rounded-lg p-2 ">
            <div className="flex items-center gap-2">
              <img
                src={post.author?.avatarUrl}
                width={50}
                height={50}
                className="rounded-full"
              />
              <div>
                <div className="flex items-center gap-2">
                <p className="font-bold">{post.author?.name}</p>
                <p className="text-sm">{formattedTime(post.post._creationTime)}</p>
                </div>
            <p className="mt-1">{post.post.body}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="w-full border-2 mt-auto">
        <div className="flex">
          <form className="flex w-full" onSubmit={(e) => sendPostMessage(e)}>
            <Input ref={postInputRef} />
            <Button type="submit">Post</Button>
          </form>
        </div>
        {/* Additional content can be added here */}
      </div>
    </>
  );
}
