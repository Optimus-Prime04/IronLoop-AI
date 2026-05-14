import { Bell, Command, Flame, Search } from "lucide-react";
import { SignOutButton } from "@/components/layout/sign-out-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Topbar({
  userEmail,
  demoMode
}: {
  userEmail?: string | null;
  demoMode?: boolean;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/84 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="min-w-0 flex-1">
          <div className="relative max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-9 bg-secondary/45 pl-9 pr-24"
              placeholder="Search mistakes, notes, chapters"
              aria-label="Search"
            />
            <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 items-center gap-1 rounded-sm border border-border bg-background px-2 py-1 text-[11px] text-muted-foreground md:flex">
              <Command className="h-3 w-3" />
              K
            </kbd>
          </div>
        </div>

        {demoMode ? <Badge variant="warning">Demo data</Badge> : null}

        <div className="hidden items-center gap-2 rounded-md border border-border bg-secondary/35 px-3 py-2 text-sm font-semibold text-warning sm:flex">
          <Flame className="h-4 w-4" aria-hidden="true" />
          14
        </div>

        <Button variant="ghost" size="icon" aria-label="Notifications" title="Notifications">
          <Bell className="h-4 w-4" aria-hidden="true" />
        </Button>

        <div className="hidden min-w-0 text-right lg:block">
          <p className="truncate text-sm font-semibold">{userEmail ?? "Disciplined student"}</p>
          <p className="text-xs text-muted-foreground">Exam mode active</p>
        </div>

        <SignOutButton />
      </div>
    </header>
  );
}
