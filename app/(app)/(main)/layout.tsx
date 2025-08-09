'use client'
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Home, Search, Settings, User } from "lucide-react";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Search", icon: Search, href: "/search" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Profile", icon: User, href: "/settings" },
];


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
   const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    
    <div>

      {!isMobile && 
        (
  
      <SidebarProvider
        style={
          {
            "--sidebar-width": "fit",
          } as React.CSSProperties
        }
      >
        <AppSidebar />

    
        <SidebarInset>

          {children}
        </SidebarInset>
      </SidebarProvider>
        )}
        
         {isMobile && (
          
          <div className="w-screen h-screen">
            {children}
        <nav className="fixed bottom-0 left-0 w-full bg-background border-t flex justify-around p-2">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="flex flex-col items-center text-xs p-4"
            >
              <item.icon className="h-8 w-8" />
            </a>
          ))}
        </nav>

          </div>

      )}
    </div>
  )
}
