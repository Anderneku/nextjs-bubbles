"use client";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@radix-ui/react-collapsible";
import { Heart, MessageSquareIcon, Send } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Id } from "@/convex/_generated/dataModel";
import { Badge } from "./ui/badge";
import { useRef, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";

type Posts = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    bubbleId: string;
    authorId: string;
    body: string;
    imageUrl: string;
  };
  author: {
    _id: Id<"users">;
    _creationTime: number;
    avatarUrl?: string | undefined;
    clerkId: string;
    name: string;
    email: string;
  } | null;
};
export default function BubblePost({
  post,
  formattedTime,
}: {
  post: Posts;
  formattedTime: (timestamp: number) => string;
}) {
  const { user } = useUser();
  const getComments = useQuery(api.comments.getComments, {
    postId: post.post._id,
  });

  const postComment = useMutation(api.comments.postComment);
  const [open, setOpen] = useState(false);

  const commentRef = useRef<HTMLInputElement>(null);
  function sendComment(e: any) {
    e.preventDefault();
    let commentBody = commentRef.current?.value;
    if (commentBody?.trim() == "") return;
    if (user) {
      console.log(commentBody);
      postComment({
        authorId: user?.id as string,
        authorProfileUrl: user?.imageUrl,
        authorName: user?.fullName as string,
        body: commentBody as string,
        postId: post.post._id as string,
      });
      if (commentRef.current) {
        commentRef.current.value = "";
      }
    }
  }

  return (
    <div
      style={{ borderRadius: "var(--radius-xl)" }}
      className="bg-card  border-border border-2 text-foreground  w-full md:w-2xl  shadow-sm p-8 "
    >
      <div className="flex items-center gap-2">
        <div className="mb-auto">
          <img
            src={post.author?.avatarUrl}
            width={50}
            height={50}
            className="rounded-full"
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-bold">{post.author?.name}</p>
            <Badge className="text-sm">
              {formattedTime(post.post._creationTime)}
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <p className="mt-1 whitespace-pre-wrap p-2">{post.post.body}</p>
        <div className="w-full h-fit flex justify-center  ">
          <img
            src={post.post.imageUrl}
            alt="Post"
            className="transition-all   hover:brightness-50 z-0  h-fit w-fit max-h-[500px] max-w-full items-center rounded-lg  object-cover"
          />
        </div>
      </div>
      <div className="w-full  flex gap-2 py-2 justify-end">
        <Button variant={"outline"}>
          <Heart />
          <span>122</span>
        </Button>
        <Button variant={"outline"} onClick={() => setOpen(!open)}>
          <MessageSquareIcon />
          <span>{getComments?.number}</span>
        </Button>
      </div>
      <Collapsible open={open} className="flex w-full flex-col gap-2">
        <CollapsibleContent className="flex flex-col gap-2">
          <div>
            <form
              className="w-full flex gap-2"
              onSubmit={(e) => sendComment(e)}
            >
              <Input ref={commentRef} />
              <Button variant={"default"}>
                <Send />
              </Button>
            </form>
          </div>
          {getComments?.comments.map((comment, index) => (
            <div
              key={index}
              className="rounded-md border px-2 py-2 font-mono text-sm w-full"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="object-cover ">
                <img className="rounded-full" width={30} height={30} src={comment.authorProfileUrl} />

                </div>
                <div className="flex flex-col w-full">
                  <h1 className="text-accent-foreground font-bold">{comment.authorName}</h1>

                  <p className=" w-full break-all">{comment.body}</p>
                </div>
              </div>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
