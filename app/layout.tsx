
import "./globals.css";
import  ConvexClientProvider  from "../lib/ConvexClientProvider";
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <ConvexClientProvider>
        <body
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </ConvexClientProvider>
    </html>
      </ClerkProvider>
  );
}
