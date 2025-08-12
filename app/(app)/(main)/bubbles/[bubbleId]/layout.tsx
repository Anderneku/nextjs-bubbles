export default function YourBubblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full flex flex-col h-full px-32 py-4">{children}</main>
  );
}
