"use client";

import { Sidebar, SidebarRail } from "@/components/ui/sidebar";
import AdminSidebarHeader from "./AdminSidebarHeader";
import AdminSidebarContent from "./AdminSidebarContent";
import AdminSidebarFooter from "./AdminSidebarFooter";
import { User } from "better-auth";

type AdminSidebarProps = {
  user: User;
};

export default function AdminSidebar({ user }: AdminSidebarProps) {
  return (
    <Sidebar variant="inset" collapsible="icon">
      <AdminSidebarHeader />
      <AdminSidebarContent />
      <AdminSidebarFooter user={user} />
      <SidebarRail />
    </Sidebar>
  );
}
