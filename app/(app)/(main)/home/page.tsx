'use client';
import HomePageTemplate from "@/components/HomePageTemplate";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";

export default function Home() {
  const {user} = useUser();
  const getBubbles = useQuery(api.bubbles.getBubbles, {userId: user?.id as string});
  
  return <div className="w-fit flex flex-col gap-4">
    {getBubbles?.map((bubble, index) => (
      <HomePageTemplate key={index} bubbleId={bubble.bubble?._id as string} />
    ))}
  </div>;
}
