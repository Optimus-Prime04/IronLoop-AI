import type { ReactNode } from "react";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Topbar } from "@/components/layout/topbar";
import { getUser } from "@/lib/supabase/server";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const user = await getUser();
  const demoMode = !user;

  return (
    <div className="min-h-screen bg-background">
      <div className="pointer-events-none fixed inset-x-0 top-0 h-80 grid-surface opacity-55" />
      <div className="relative flex min-h-screen">
        <AppSidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <Topbar userEmail={user?.email} demoMode={demoMode} />
          <main className="flex-1 px-4 pb-24 pt-5 md:px-6 lg:px-8 xl:pb-8">{children}</main>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
