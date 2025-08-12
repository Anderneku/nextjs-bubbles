export default function YourBubblesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="w-full h-full p-0 flex justify-center items-center">
      {children}
    </main>
  );
}
