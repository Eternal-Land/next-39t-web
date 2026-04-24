export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Admin Dashboard Layout</h1>
      <div>{children}</div>
    </div>
  );
}
