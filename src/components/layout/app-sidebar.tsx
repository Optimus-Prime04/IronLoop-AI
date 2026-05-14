"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { appName, navItems } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-72 shrink-0 border-r border-border bg-background/82 px-4 py-5 backdrop-blur xl:block">
      <Link href="/dashboard" className="mb-8 flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/35 bg-primary/15 text-sm font-black text-primary shadow-glow">
          IL
        </div>
        <div>
          <p className="text-sm font-black">{appName}</p>
          <p className="text-xs text-muted-foreground">Study operating system</p>
        </div>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-10 items-center gap-3 rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground",
                isActive && "bg-primary/12 text-primary ring-1 ring-primary/25"
              )}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8 rounded-lg border border-border bg-secondary/35 p-4">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Current loop</p>
        <p className="mt-2 text-sm font-semibold">Weak topic elimination</p>
        <div className="mt-3 h-2 overflow-hidden rounded-sm bg-background">
          <div className="h-full w-[68%] rounded-sm bg-primary" />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">68% of this week complete</p>
      </div>
    </aside>
  );
}
