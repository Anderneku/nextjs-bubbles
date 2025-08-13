export default function YourBubblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full flex flex-col h-full md:ml-[49px]  py-4">{children}</main>
  );
}
