import ConvexClientProvider from "@/lib/ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <ConvexClientProvider>
        <div className="h-full" >{children}</div>
      </ConvexClientProvider>
    </ClerkProvider>
  );
}
