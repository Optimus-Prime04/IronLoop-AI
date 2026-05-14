"use client";

import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();

  async function signOut() {
    if (!isSupabaseBrowserConfigured()) {
      router.push("/login");
      return;
    }

    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
    router.push("/login");
  }

  return (
    <Button variant="ghost" size="icon" onClick={signOut} aria-label="Sign out" title="Sign out">
      <LogOut className="h-4 w-4" aria-hidden="true" />
    </Button>
  );
}
