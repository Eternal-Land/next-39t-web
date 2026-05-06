import { headers } from "next/headers";
import { redirect } from "next/navigation";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import AdminSidebar from "@/components/pages/AdminDashboard/AdminSidebar";
import { auth } from "@/lib/auth";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await auth.api.getSession({
    headers: await headers(),
  });

  if (!data?.user) {
    redirect("/admin/login");
  }

  return (
    <SidebarProvider>
      <AdminSidebar user={data.user} />
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <span className="text-sm font-medium">Admin Dashboard</span>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
