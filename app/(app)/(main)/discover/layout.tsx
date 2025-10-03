import { Toaster } from "@/components/ui/sonner";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className=" flex flex-col h-full md:ml-[49px] pb-4 relative" style={{
        backgroundImage: "url('/images/bubblelogo.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}>
        <Toaster position="top-center" />

      {children}
    </main>
  );
}
