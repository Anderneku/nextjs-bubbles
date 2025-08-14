'use client';
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery } from "convex/react";
import { useEffect, useRef } from "react";
import HomeBubblePost from "./HomeBubblePage";

export default function HomePageTemplate({ bubbleId }: { bubbleId: string }) {
  const {
    results: posts,
    loadMore,
    status,
  } = usePaginatedQuery(
    api.posts.getPosts,
    { bubbleId: bubbleId },
    { initialNumItems: 10 }
  );

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
      {posts.map((post, index) => (
        <HomeBubblePost formattedTime={formattedTime} post={post} key={index} />
      ))}
      <div ref={loadMoreRef} />
    </>
  );
}
