"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

export default function InitUserSync() {
  const { user } = useUser();
  const createUser = useMutation(api.users.createUserIfNotExists);

  useEffect(() => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress ?? "",
        avatarUrl: user.imageUrl,
      });
    }
  }, [user, createUser]);

  return null; // This component doesn’t render anything
}
