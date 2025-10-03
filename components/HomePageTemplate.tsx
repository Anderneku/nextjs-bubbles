"use client";
import { api } from "@/convex/_generated/api";
import { usePaginatedQuery, useQuery } from "convex/react";
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

  function formatDate(timestamp: number) {
    const today = new Date();
    const date = new Date(timestamp);

    // Format as '12 Aug'
    const day = date.getDate();
    const Todayday = today.getDate();

    if (day == Todayday || day == Todayday-1) {
      return true;
    } else {
      return false;
    }
  }
  return (
    <>
      {posts.map((post, index) => (
        <div key={index} className="m-0">
        {formatDate(post.post._creationTime) == true && (

          <HomeBubblePost
            formattedTime={formattedTime}
            post={post}
            bubbleId={bubbleId}
          />
        )}
        {formatDate(post.post._creationTime) == false && (

          <HomeBubblePost
            formattedTime={formattedTime}
            post={post}
            bubbleId={bubbleId}
          />
        )}
        </div>
      ))}
      <div ref={loadMoreRef} />
    </>
  );
}
