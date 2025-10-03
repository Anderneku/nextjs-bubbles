"use client";
import JoinBubbleAlert from "@/components/alerts/JoinBubbleAlert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useSearchParams } from "next/navigation";
import router from "next/router";
import { useEffect, useRef, useState } from "react";

export default function DiscoverPage() {
    // Search Params + Focus SearchBar
  const searchRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const focusSearch = searchParams.get("focusSearch") === "true";
  useEffect(() => {
    if (focusSearch && searchRef.current) {
      searchRef.current.focus();
    }
  }, [focusSearch]);

  const { user } = useUser();
  const [openAlert, setOpenAlert] = useState(false);
  const [search, setSearch] = useState("");

  const searchBubbles = useQuery(api.bubbles.searchBubbles, {
    searchTerm: search as string,
  });
  function onSearchInputChanged(e: any) {
    setSearch(e.target.value);
  }
  return (
    <>
      <div className="w-full h-full flex flex-col items-center">
        <div className=" sticky text-secondary  z-10 p-4  w-full  ">
          <Input
          
            ref={searchRef}
            placeholder="Search Bubbles"
            onInput={(e) => onSearchInputChanged(e)}
          />
        </div>
        {searchBubbles?.map((bubble, index) => (
          <Card
            key={index}
            className="w-full md:w-2xl transition-all hover:scale-110 cursor-default"
          >
            <CardContent className="w-full ">
              <div className="flex gap-4 w-full ">
                {/* Bubble Icon */}
                <div>
                  <img src={bubble?.iconUrl} width={100} height={100} />
                </div>
                {/* Other Content */}
                <div className="flex flex-col w-full">
                  <div className="w-full flex items-center gap-4">
                    <h1 className="font-bold text-2xl break-all">
                      {bubble?.name}
                    </h1>
                  </div>
                  <div className="w-full h-full">
                    <p className="text-base  break-all truncate">
                      {bubble?.description}
                    </p>
                  </div>
                </div>

                <Button onClick={() => setOpenAlert(true)} className="mt-auto">
                  Join Bubble <ArrowRight />
                </Button>
                <JoinBubbleAlert
                  open={openAlert}
                  setOpen={setOpenAlert}
                  bubbleId={bubble._id as string}
                  userId={user?.id as string}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
