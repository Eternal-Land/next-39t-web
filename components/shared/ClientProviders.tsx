"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "../ui/sonner";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TooltipProvider>{children}</TooltipProvider>
      <Toaster position="top-center" />
    </>
  );
}
