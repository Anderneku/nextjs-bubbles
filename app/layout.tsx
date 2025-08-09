
import "./globals.css";
import { ConvexClientProvider } from "../lib/ConvexClientProvider";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <ConvexClientProvider>
        <body
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </ConvexClientProvider>
    </html>
  );
}
