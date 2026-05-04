import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await auth.api.getSession({
    headers: await headers()
  })

  return (
    <div>
      <h1>Admin Dashboard Layout</h1>
      {data?.user && (
        <div>
          <p>Hello {data.user.name}!</p>
          <Button>Logout</Button>
        </div>
      )}
      <div>{children}</div>
    </div>
  );
}
