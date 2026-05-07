import LandingFooter from "@/components/pages/HomePage/LandingFooter";
import LandingHeader from "@/components/pages/HomePage/LandingHeader";

export default function FrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingHeader />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
