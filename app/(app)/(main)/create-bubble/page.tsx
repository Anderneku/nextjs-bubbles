"use client";
import { CreateBubbleForm } from "@/components/forms/createBubble";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as React from "react";

export default function CreateBubble() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="font-bold text-2xl">Create a Bubble</CardTitle>

        <CardDescription>
          Blow a New Bubble to Start Your New Community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <CreateBubbleForm />
      </CardContent>
    </Card>
  );
}
