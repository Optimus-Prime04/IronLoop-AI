import type { LucideIcon } from "lucide-react";
import { Headphones, ShieldCheck, TimerReset } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PomodoroTimer } from "@/components/planner/pomodoro";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FocusPage() {
  const rules = [
    "Phone outside reach",
    "One chapter outcome",
    "Mistake log open",
    "No passive rereading",
    "Five-minute recall at end"
  ];

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Focus mode"
        title="Deep work without negotiation."
        description="A low-friction focus surface for Pomodoro blocks, session rules, and discipline tracking."
      />

      <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <PomodoroTimer />
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Session protocol</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {rules.map((rule) => (
                <div key={rule} className="flex items-center gap-3 rounded-md border border-border bg-secondary/25 p-3">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  <span className="text-sm font-semibold">{rule}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Current sprint</CardTitle>
                <p className="text-sm text-muted-foreground">Physics - Current Electricity - mixed circuits</p>
              </div>
              <Badge variant="warning">High priority</Badge>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-3">
              <FocusMetric icon={TimerReset} label="Target" value="45m" />
              <FocusMetric icon={Headphones} label="Mode" value="Silent" />
              <FocusMetric icon={ShieldCheck} label="Score" value="92" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function FocusMetric({
  icon: Icon,
  label,
  value
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-secondary/25 p-4">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-black">{value}</p>
    </div>
  );
}
