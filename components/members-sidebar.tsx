"use client";

import * as React from "react";
import {
  ArchiveX,
  Command,
  File,
  Inbox,
  Send,
  Trash2,
  Home,
  Search,
  Compass,
  School,
  FileIcon,
  Bubbles,
  SearchIcon,
  Plus,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from "@/components/ui/sidebar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "./ui/separator";
import { useRouter } from "nextjs-toploader/app";
import { UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

// This is sample data
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/home",
      icon: Home,
      isActive: true,
    },
    {
      title: "Search",
      url: "/discover?focusSearch=true",
      icon: SearchIcon,
      isActive: false,
    },
    {
      title: "Discover",
      url: "/discover",
      icon: Compass,
      isActive: false,
    },
    {
      title: "Your Bubbles",
      url: "/bubbles",
      icon: Bubbles,
      isActive: false,
    },
  ],
  navSecondary: [
    {
      title: "New Bubble",
      url: "/create-bubble",
      icon: Plus,
      isActive: false,
    },
  ],
};

export function MembersSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // Note: I'm using state to show active item.
  // IRL you should use the url/router.
  const router = useRouter();
  const { user } = useUser();
  const getBubbles = useQuery(api.bubbles.getBubbles, {
    userId: user?.id as string,
  });
  const [activeItem, setActiveItem] = React.useState(data.navMain[0]);
  const { setOpen } = useSidebar();

  function goToPage(link: string) {
    router.push(link);
  }

  function goToCreateBubble() {
    router.push("/create-bubble");
  }

  return (
    <>
      <Sidebar
        side="right"
        collapsible="icon"
        className="w-[calc(var(--sidebar-width-icon)+1px)]! border-r z-[100]"
      >
        <SidebarHeader className="w-full flex items-center justify-center">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip={{ children: "Bubbles", hidden: false }}
                size="lg"
                asChild
                className="md:h-8 md:p-0"
              >
                <a href="#">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <img
                      src={"/images/bubblelogo1.png"}
                      width={25}
                      height={25}
                    />
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <Separator />
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="flex flex-col gap-4">
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{
                        children: item.title,
                        hidden: false,
                      }}
                      onClick={() => {
                        setActiveItem(item);
                        setOpen(true);
                        goToPage(item.url);
                      }}
                      isActive={activeItem?.title === item.title}
                      className="px-2.5 md:px-2"
                    >
                      <item.icon className="scale-125" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <Separator />
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu className="flex flex-col gap-4">
                {getBubbles?.map((bubble, index) => (
                  <a key={index} href={`bubbles/${bubble.bubble?.slug}`}>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        tooltip={{
                          children: <span>{bubble.bubble?.name}</span>,
                          hidden: false,
                        }}
                        className="w-full h-full"
                      >
                        <img src={bubble.bubble?.iconUrl} />
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </a>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <Separator />
        <SidebarFooter className="w-full flex justify-center items-center">
          <SidebarMenu className="flex flex-col gap-4">
            {data.navSecondary.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={{
                    children: item.title,
                    hidden: false,
                  }}
                  onClick={() => {
                    setActiveItem(item);
                    setOpen(true);
                    goToCreateBubble();
                  }}
                  isActive={activeItem?.title === item.title}
                  className="px-2.5 md:px-2 bg-primary text-primary-foreground hover:h-16 hover:bg-primary hover:text-primary-foreground"
                >
                  <item.icon className="scale-125" />
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <UserButton />
        </SidebarFooter>
      </Sidebar>
    </>
  );
}
