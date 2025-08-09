"use client";

import { Authenticated, Unauthenticated } from "convex/react";
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
import { useRouter } from "next/navigation";
import InitUserSync from "@/lib/InitUserSync";

export default function Login() {
  const { user, isLoaded, isSignedIn } = useUser();
  const router = useRouter();
  const goHome = async () => {
    router.push("/home");
  };
  return (
    <div className="flex items-center justify-center h-screen">
    <InitUserSync/>
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
              onClick={goHome}
              className="transition-all shadow-2xl hover:scale-125 active:scale-75"
            >
              Pop Into Your Bubble <ArrowRight />
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
            <SignInButton >
            <Button variant={"secondary"} className="transition-all hover:scale-125 active:scale-90">Login</Button>
            </SignInButton>
            <SignUpButton>
              <Button  className="transition-all hover:scale-125 active:scale-90">Sign Up</Button>
            </SignUpButton>
          </CardFooter>
        </Card>
      </Unauthenticated>
    </div>
  );
}
