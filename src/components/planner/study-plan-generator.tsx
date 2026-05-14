"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function StudyPlanGenerator() {
  const [input, setInput] = useState(
    "JEE + CBSE, weak in Current Electricity and Organic Chemistry, 5 hours available today."
  );
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generatePlan() {
    setLoading(true);
    setError(null);

    const response = await fetch("/api/planner", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ context: input })
    });

    const payload = (await response.json()) as { plan?: string; error?: string };
    setLoading(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not generate plan.");
      return;
    }

    setPlan(payload.plan ?? null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI study plan</CardTitle>
        <p className="text-sm text-muted-foreground">Turn constraints, weak topics, and exam goals into a daily plan.</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea value={input} onChange={(event) => setInput(event.target.value)} />
        {error ? (
          <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {error}
          </p>
        ) : null}
        <Button onClick={generatePlan} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          Generate plan
        </Button>
        {plan ? (
          <div className="whitespace-pre-wrap rounded-lg border border-border bg-background/60 p-4 text-sm leading-6">
            {plan}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
