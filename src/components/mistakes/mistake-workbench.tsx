"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { AlertTriangle, Filter, Loader2, Search, Sparkles, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { coreSubjects, masteryLevels, severities } from "@/lib/constants";
import type { MasteryLevel, Mistake, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

type DraftMistake = {
  subject: string;
  chapter: string;
  mistake: string;
  root_cause: string;
  correct_concept: string;
  severity: Severity;
  mastery_level: MasteryLevel;
};

const initialDraft: DraftMistake = {
  subject: "Physics",
  chapter: "",
  mistake: "",
  root_cause: "",
  correct_concept: "",
  severity: "medium",
  mastery_level: "new"
};

export function MistakeWorkbench({ initialMistakes }: { initialMistakes: Mistake[] }) {
  const [mistakes, setMistakes] = useState(initialMistakes);
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [fixed, setFixed] = useState("all");
  const [draft, setDraft] = useState<DraftMistake>(initialDraft);
  const [saving, setSaving] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return mistakes.filter((mistake) => {
      const matchesSearch =
        !search ||
        [
          mistake.subject,
          mistake.chapter,
          mistake.mistake,
          mistake.root_cause,
          mistake.correct_concept,
          mistake.tags.join(" ")
        ]
          .join(" ")
          .toLowerCase()
          .includes(search);

      const matchesSubject = subject === "all" || mistake.subject === subject;
      const matchesSeverity = severity === "all" || mistake.severity === severity;
      const matchesFixed =
        fixed === "all" || (fixed === "fixed" ? mistake.fixed : !mistake.fixed);

      return matchesSearch && matchesSubject && matchesSeverity && matchesFixed;
    });
  }, [fixed, mistakes, query, severity, subject]);

  const stats = useMemo(() => {
    const repeated = mistakes.filter((mistake) => mistake.repeat_count > 1).length;
    const critical = mistakes.filter((mistake) =>
      ["critical", "high"].includes(mistake.severity)
    ).length;
    const fixedCount = mistakes.filter((mistake) => mistake.fixed).length;
    return {
      repeated,
      critical,
      fixedRate: mistakes.length ? Math.round((fixedCount / mistakes.length) * 100) : 0
    };
  }, [mistakes]);

  async function saveMistake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaving(true);

    const response = await fetch("/api/mistakes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft)
    });

    const payload = (await response.json()) as { mistake?: Mistake; error?: string };
    setSaving(false);

    if (!response.ok || !payload.mistake) {
      setError(payload.error ?? "Could not save mistake.");
      return;
    }

    setMistakes((current) => [payload.mistake!, ...current]);
    setDraft(initialDraft);
  }

  async function analyzeMistakes() {
    setAnalyzing(true);
    setAnalysis(null);
    setError(null);

    const response = await fetch("/api/mistakes/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mistakes: filtered.slice(0, 20) })
    });

    const payload = (await response.json()) as { analysis?: string; error?: string };
    setAnalyzing(false);

    if (!response.ok) {
      setError(payload.error ?? "Could not analyze mistakes.");
      return;
    }

    setAnalysis(payload.analysis ?? null);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.45fr_0.85fr]">
      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <StatTile title="Repeat signals" value={`${stats.repeated}`} icon={Target} tone="primary" />
          <StatTile title="High-risk errors" value={`${stats.critical}`} icon={AlertTriangle} tone="danger" />
          <StatTile title="Fixed rate" value={`${stats.fixedRate}%`} icon={Sparkles} tone="success" />
        </div>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Mistake log</CardTitle>
              <p className="text-sm text-muted-foreground">Search, filter, and identify repeated mistake loops.</p>
            </div>
            <Button variant="outline" onClick={analyzeMistakes} disabled={analyzing || filtered.length === 0}>
              {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              Analyze
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-[1fr_150px_150px_140px]">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search root cause, chapter, tag"
                  className="pl-9"
                />
              </div>
              <select
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                className="h-10 rounded-md border border-input bg-background/60 px-3 text-sm"
                aria-label="Subject filter"
              >
                <option value="all">All subjects</option>
                {Array.from(new Set(mistakes.map((mistake) => mistake.subject))).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
                className="h-10 rounded-md border border-input bg-background/60 px-3 text-sm"
                aria-label="Severity filter"
              >
                <option value="all">All severity</option>
                {severities.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select
                value={fixed}
                onChange={(event) => setFixed(event.target.value)}
                className="h-10 rounded-md border border-input bg-background/60 px-3 text-sm"
                aria-label="Status filter"
              >
                <option value="all">All status</option>
                <option value="open">Open</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>

            <div className="mt-4 overflow-hidden rounded-lg border border-border">
              <div className="hidden grid-cols-[0.9fr_1fr_1.2fr_110px_90px] gap-4 border-b border-border bg-secondary/45 px-4 py-3 text-xs font-black uppercase text-muted-foreground lg:grid">
                <span>Subject</span>
                <span>Root cause</span>
                <span>Correction</span>
                <span>Severity</span>
                <span>Status</span>
              </div>
              <div className="divide-y divide-border">
                {filtered.map((mistake) => (
                  <div
                    key={mistake.id}
                    className="grid gap-3 bg-background/40 px-4 py-4 text-sm transition-colors hover:bg-secondary/25 lg:grid-cols-[0.9fr_1fr_1.2fr_110px_90px]"
                  >
                    <div>
                      <p className="font-semibold">{mistake.subject}</p>
                      <p className="text-muted-foreground">{mistake.chapter}</p>
                      {mistake.repeat_count > 1 ? (
                        <Badge className="mt-2" variant="warning">
                          repeated {mistake.repeat_count}x
                        </Badge>
                      ) : null}
                    </div>
                    <div>
                      <p>{mistake.root_cause}</p>
                      <p className="mt-1 text-muted-foreground">{mistake.mistake}</p>
                    </div>
                    <div>{mistake.correct_concept}</div>
                    <div>
                      <Badge
                        variant={
                          mistake.severity === "critical"
                            ? "destructive"
                            : mistake.severity === "high"
                              ? "warning"
                              : "secondary"
                        }
                      >
                        {mistake.severity}
                      </Badge>
                    </div>
                    <div>
                      <Badge variant={mistake.fixed ? "success" : "secondary"}>
                        {mistake.fixed ? "fixed" : mistake.mastery_level}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {analysis ? (
          <Card>
            <CardHeader>
              <CardTitle>AI repeat detection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{analysis}</div>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add mistake</CardTitle>
          <p className="text-sm text-muted-foreground">Root-cause the error while the test is still fresh.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={saveMistake} className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <select
                  id="subject"
                  value={draft.subject}
                  onChange={(event) => setDraft({ ...draft, subject: event.target.value })}
                  className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                >
                  {coreSubjects.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="chapter">Chapter</Label>
                <Input
                  id="chapter"
                  value={draft.chapter}
                  onChange={(event) => setDraft({ ...draft, chapter: event.target.value })}
                  placeholder="Current Electricity"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mistake">Mistake</Label>
              <Textarea
                id="mistake"
                value={draft.mistake}
                onChange={(event) => setDraft({ ...draft, mistake: event.target.value })}
                placeholder="What went wrong?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="root">Root cause</Label>
              <Textarea
                id="root"
                value={draft.root_cause}
                onChange={(event) => setDraft({ ...draft, root_cause: event.target.value })}
                placeholder="Why did it happen?"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="concept">Correct concept</Label>
              <Textarea
                id="concept"
                value={draft.correct_concept}
                onChange={(event) => setDraft({ ...draft, correct_concept: event.target.value })}
                placeholder="What should you remember next time?"
                required
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="severity">Severity</Label>
                <select
                  id="severity"
                  value={draft.severity}
                  onChange={(event) => setDraft({ ...draft, severity: event.target.value as Severity })}
                  className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                >
                  {severities.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mastery">Mastery</Label>
                <select
                  id="mastery"
                  value={draft.mastery_level}
                  onChange={(event) =>
                    setDraft({ ...draft, mastery_level: event.target.value as MasteryLevel })
                  }
                  className="h-10 w-full rounded-md border border-input bg-background/60 px-3 text-sm"
                >
                  {masteryLevels.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error ? (
              <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Filter className="h-4 w-4" />}
              Save mistake
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  title,
  value,
  icon: Icon,
  tone
}: {
  title: string;
  value: string;
  icon: LucideIcon;
  tone: "primary" | "danger" | "success";
}) {
  return (
    <Card>
      <CardContent className="flex items-center justify-between p-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-black">{value}</p>
        </div>
        <Icon
          className={cn(
            "h-5 w-5",
            tone === "primary" && "text-primary",
            tone === "danger" && "text-destructive",
            tone === "success" && "text-success"
          )}
        />
      </CardContent>
    </Card>
  );
}
