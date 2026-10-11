"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { ReminderScheduler } from "@/components/notifications/ReminderScheduler";
import { useAuthStore } from "@/store/useAuthStore";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const profile = useAuthStore((state) => state.profile);
  const loading = useAuthStore((state) => state.loading);
  const isAuthRoute = pathname === "/login" || pathname === "/register";

  useEffect(() => {
    if (!loading && !profile && !isAuthRoute) {
      router.replace("/login");
    }
  }, [isAuthRoute, loading, pathname, profile, router]);

  if (loading || (!profile && !isAuthRoute)) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-gray-500" role="status">
        Cargando tu espacio...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-transparent">
      <ReminderScheduler />
      {!isAuthRoute && <Sidebar />}
      <div className="flex-1 pb-20 lg:pb-0">{children}</div>
      {!isAuthRoute && <MobileNav />}
    </div>
  );
}
