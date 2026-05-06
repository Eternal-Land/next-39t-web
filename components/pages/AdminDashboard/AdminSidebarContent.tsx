"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  NotebookPenIcon,
  PlaneLandingIcon,
  // SettingsIcon,
  // UsersIcon,
} from "lucide-react";

import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const navItems = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: HomeIcon,
  },
  {
    title: "Landing Page",
    url: "/admin/landing",
    icon: PlaneLandingIcon,
  },
  {
    title: "Posts",
    url: "/admin/posts",
    icon: NotebookPenIcon,
  },
  // {
  //   title: "Users",
  //   url: "/admin/users",
  //   icon: UsersIcon,
  // },
  // {
  //   title: "Settings",
  //   url: "/admin/settings",
  //   icon: SettingsIcon,
  // },
];

export default function AdminSidebarContent() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.url}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
