"use client";
import HomePageTemplate from "@/components/HomePageTemplate";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

export default function HomePage() {
  const { user } = useUser();
  const getBubbles = useQuery(api.bubbles.getBubbles, {
    userId: user?.id as string,
  });

  return (
    <div className="w-full h-full flex flex-col items-center">
      <div className="sticky bg-sidebar text-secondary border-b-2 z-10 p-4 top-0 flex w-full justify-center items-center gap-2 ">
        <h1 className="text-3xl">Your Feed</h1>
      </div>
      <br />
      <div className="flex flex-col gap-4 w-full items-center p-4 ">
        {getBubbles?.map((bubble, index) => (
          <HomePageTemplate
            key={index}
            bubbleId={bubble.bubble?._id as string}
          />
        ))}
      </div>
    </div>
  );
}
