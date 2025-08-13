import { Button } from "@/components/ui/button";

export default function YourBubblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      className="w-full  flex flex-col h-full md:ml-[49px]  pb-4 relative"
      style={{
        backgroundImage: "url('/images/bubblelogo.png')",
        backgroundRepeat: "repeat",
        backgroundSize: "auto",
      }}
    >
      {children}
    </main>
  );
}
