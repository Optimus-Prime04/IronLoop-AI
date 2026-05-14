import type { LucideIcon } from "lucide-react";
import { GraduationCap, LockKeyhole, Trophy } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getUser } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await getUser();

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Student profile"
        title="Personalize the exam engine."
        description="Keep exam track, subjects, targets, and secure account settings in one place."
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email ?? "demo@student.com"} readOnly />
            </div>
            <div className="space-y-2">
              <Label>Exam track</Label>
              <Input value="JEE + CBSE" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Target score</Label>
              <Input value="95% boards - 99 percentile JEE" readOnly />
            </div>
            <div className="space-y-2">
              <Label>Daily capacity</Label>
              <Input value="5.5 focused hours" readOnly />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <StatusRow icon={LockKeyhole} label="Secure auth" value="Supabase RLS" />
            <StatusRow icon={GraduationCap} label="Subjects" value="7 active" />
            <StatusRow icon={Trophy} label="Leaderboard" value="Ready" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-md border border-border bg-secondary/25 p-3">
      <div className="flex items-center gap-3">
        <Icon className="h-4 w-4 text-primary" />
        <span className="text-sm font-semibold">{label}</span>
      </div>
      <Badge variant="secondary">{value}</Badge>
    </div>
  );
}
