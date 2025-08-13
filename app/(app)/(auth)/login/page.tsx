"use client";

import { Authenticated, Unauthenticated, useMutation } from "convex/react";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "nextjs-toploader/app";
import InitUserSync from "@/lib/InitUserSync";
import { useEffect } from "react";

export default function Login() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const createUser = useMutation(api.users.createUserIfNotExists);

  const goHome = async () => {
    if (user) {
      createUser({
        clerkId: user.id,
        name: `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
        email: user.primaryEmailAddress?.emailAddress ?? "",
        avatarUrl: user.imageUrl,
      });
    }
    router.push("/home");
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Authenticated>
        <Card className="transition-all scale-110 hover:scale-125 w-lg ">
          <CardHeader>
            <CardTitle className="text-center text-4xl flex flex-col gap-4 justify-center items-center">
              <UserButton
                appearance={{
                  elements: { avatarBox: { width: 80, height: 80 } },
                }}
              />
              {user?.fullName}
            </CardTitle>
            <CardDescription className="text-center">
              Welcome Back!
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full flex justify-center font-semibold text-3xl"></CardContent>
          <CardFooter className="w-full flex justify-center gap-4">
            <Button
              onClick={() => goHome()}
              disabled={!isLoaded}
              className="transition-all shadow-2xl hover:scale-125 active:scale-75"
            >
              Pop Into Your Bubbles <ArrowRight />
            </Button>
          </CardFooter>
        </Card>
      </Authenticated>

      <Unauthenticated>
        <Card className="transition-all scale-110 hover:scale-125 w-lg ">
          <CardHeader>
            <CardTitle className="text-center text-4xl">
              🚀 Ready When You Are!
            </CardTitle>
            <CardDescription className="text-center">
              Picking Up Where You Left? Starting a New Journey?
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full flex justify-center font-semibold text-3xl"></CardContent>
          <CardFooter className="w-full flex justify-center gap-4">
            <Button
              asChild
              variant={"secondary"}
              className="transition-all hover:scale-125 active:scale-90"
            >
              <SignInButton>Login</SignInButton>
            </Button>
            <Button
              asChild
              className="transition-all hover:scale-125 active:scale-90"
            >
              <SignUpButton>Sign Up</SignUpButton>
            </Button>
          </CardFooter>
        </Card>
      </Unauthenticated>
    </div>
  );
}
