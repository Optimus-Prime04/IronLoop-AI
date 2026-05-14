"use client";

import { useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { assistantModes } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function AssistantConsole() {
  const [mode, setMode] = useState("concept");
  const [message, setMessage] = useState(
    "Explain Kirchhoff's law for mixed circuits and give me a board + JEE style example."
  );
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function askAssistant() {
    setLoading(true);
    setError(null);
    setResponse(null);

    const result = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mode, message })
    });

    const payload = (await result.json()) as { answer?: string; error?: string };
    setLoading(false);

    if (!result.ok) {
      setError(payload.error ?? "The AI assistant could not respond.");
      return;
    }

    setResponse(payload.answer ?? "");
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <CardHeader>
          <CardTitle>Tutor mode</CardTitle>
          <p className="text-sm text-muted-foreground">Pick the output you need before asking.</p>
        </CardHeader>
        <CardContent className="grid gap-2">
          {assistantModes.map((item) => {
            const Icon = item.icon;
            const active = mode === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => setMode(item.value)}
                className={cn(
                  "flex items-center gap-3 rounded-md border border-border bg-secondary/20 px-3 py-3 text-left text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground",
                  active && "border-primary/45 bg-primary/12 text-primary"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <CardTitle>AI study assistant</CardTitle>
            <p className="text-sm text-muted-foreground">Concepts, quizzes, flashcards, NCERT simplification, and revision advice.</p>
          </div>
          <Sparkles className="h-5 w-5 text-primary" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea value={message} onChange={(event) => setMessage(event.target.value)} />
          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          <Button onClick={askAssistant} disabled={loading || !message.trim()}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            Ask IRONLOOP
          </Button>
          {response ? (
            <div className="whitespace-pre-wrap rounded-lg border border-border bg-background/70 p-4 text-sm leading-6">
              {response}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
