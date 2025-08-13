"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";

export default function YourBubbles() {
  const router = useRouter();
  const { user } = useUser();
  const userBubbles = useQuery(api.bubbles.getBubbles, {
    userId: user?.id as string,
  });
  return (
    <div className="w-fit flex flex-col gap-4">
      {userBubbles?.map((userBubble, index) => (
        <Card
          key={index}
          className="w-2xl transition-all hover:scale-110 cursor-default"
        >
          <CardContent className="w-full ">
            <div className="flex gap-4 w-full ">
              {/* Bubble Icon */}
              <div>
                <img
                  src={userBubble.bubble?.iconUrl}
                  width={100}
                  height={100}
                />
              </div>
              {/* Other Content */}
              <div className="flex flex-col w-full">
                <div className="w-full flex items-center gap-4">
                  <h1 className="font-bold text-2xl break-all">
                    {userBubble.bubble?.name}
                  </h1>
                  <Badge variant={"secondary"}>
                    {userBubble.role[0].toUpperCase() +
                      userBubble.role.slice(1)}
                  </Badge>
                </div>
                <div className="w-full h-full">
                  <p className="text-bas  break-all truncate">
                    {userBubble.bubble?.description}
                  </p>
                </div>
              </div>
              <Button
                onClick={() =>
                  router.push(`/bubbles/${userBubble.bubble?.slug}`)
                }
                className="mt-auto"
              >
                Enter Bubble <ArrowRight />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
