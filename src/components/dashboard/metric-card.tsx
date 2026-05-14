import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MetricCard({
  title,
  value,
  detail,
  icon: Icon,
  tone = "primary"
}: {
  title: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    primary: "text-primary bg-primary/12 border-primary/25",
    success: "text-success bg-success/12 border-success/25",
    warning: "text-warning bg-warning/12 border-warning/25",
    danger: "text-destructive bg-destructive/12 border-destructive/25"
  }[tone];

  return (
    <Card className="animate-fade-up">
      <CardContent className="flex items-start justify-between gap-4 p-5">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-black">{value}</p>
          <p className="mt-2 text-xs text-muted-foreground">{detail}</p>
        </div>
        <div className={cn("rounded-md border p-2", toneClass)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
