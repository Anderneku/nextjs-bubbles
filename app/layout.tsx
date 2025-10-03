import "./globals.css";
import NextTopLoader from "nextjs-toploader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-full h-full">
      <body suppressHydrationWarning={true} className="w-full h-full">
        <NextTopLoader />
        {children}
      </body>
    </html>
  );
}
