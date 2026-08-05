"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  return (
    <div className="flex min-h-screen bg-transparent">
      {!isAuthRoute && <Sidebar />}
      <div className="flex-1 pb-20 lg:pb-0">{children}</div>
      {!isAuthRoute && <MobileNav />}
    </div>
  );
}
