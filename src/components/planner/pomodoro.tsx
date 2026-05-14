"use client";

import { useEffect, useMemo, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const focusSeconds = 25 * 60;
const breakSeconds = 5 * 60;

export function PomodoroTimer() {
  const [secondsLeft, setSecondsLeft] = useState(focusSeconds);
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<"focus" | "break">("focus");

  useEffect(() => {
    if (!running) return;

    const interval = window.setInterval(() => {
      setSecondsLeft((current) => {
        if (current > 1) return current - 1;
        setMode((previous) => (previous === "focus" ? "break" : "focus"));
        return mode === "focus" ? breakSeconds : focusSeconds;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [mode, running]);

  const progress = useMemo(() => {
    const total = mode === "focus" ? focusSeconds : breakSeconds;
    return ((total - secondsLeft) / total) * 100;
  }, [mode, secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (secondsLeft % 60).toString().padStart(2, "0");

  function reset() {
    setRunning(false);
    setMode("focus");
    setSecondsLeft(focusSeconds);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pomodoro focus</CardTitle>
        <p className="text-sm text-muted-foreground">25 minute deep work blocks with clean recovery.</p>
      </CardHeader>
      <CardContent>
        <div className="relative mx-auto flex aspect-square max-w-[260px] items-center justify-center rounded-full border border-primary/30 bg-primary/10">
          <div
            className="absolute inset-3 rounded-full border border-primary/20"
            style={{
              background: `conic-gradient(hsl(var(--primary)) ${progress}%, transparent ${progress}%)`
            }}
          />
          <div className="relative flex h-[78%] w-[78%] flex-col items-center justify-center rounded-full bg-background">
            <p className="text-xs font-black uppercase text-primary">{mode}</p>
            <p className="mt-2 text-5xl font-black tabular-nums">{minutes}:{seconds}</p>
          </div>
        </div>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => setRunning((value) => !value)}>
            {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {running ? "Pause" : "Start"}
          </Button>
          <Button variant="outline" size="icon" onClick={reset} aria-label="Reset timer" title="Reset timer">
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
