import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
  "/home",
  "/create-bubble",
  "/bubbles(.*)",
]);
const isPublicRoute = createRouteMatcher(["/", "/login"]);

export default clerkMiddleware(async (auth, req) => {
  const { pathname } = req.nextUrl;

  // Always allow public routes - NO AUTH CHECK
  if (isPublicRoute(req)) {
    return NextResponse.next();
  }

  // Only protect /app routes
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    if (!userId) {
      const loginUrl = new URL("/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Allow everything else
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
