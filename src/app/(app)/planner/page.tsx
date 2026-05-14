import { CalendarDays, CheckCircle2, Clock, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { PomodoroTimer } from "@/components/planner/pomodoro";
import { StudyPlanGenerator } from "@/components/planner/study-plan-generator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getRevisionTasks } from "@/lib/data/queries";

export default async function PlannerPage() {
  const tasks = await getRevisionTasks();

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Study planner"
        title="Plan the day, protect the deep work."
        description="AI scheduling, subject priority, spaced revision, and Pomodoro focus blocks."
        actions={
          <Button variant="outline">
            <SlidersHorizontal className="h-4 w-4" />
            Priorities
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Smart revision schedule</CardTitle>
                <p className="text-sm text-muted-foreground">Due tasks are generated from mistakes, tests, and spaced repetition.</p>
              </div>
              <CalendarDays className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent className="space-y-3">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="grid gap-3 rounded-lg border border-border bg-secondary/25 p-4 md:grid-cols-[1fr_auto]"
                >
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">{task.title}</p>
                      <Badge variant={task.status === "complete" ? "success" : "secondary"}>
                        {task.status.replace("_", " ")}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {task.subject} - {task.chapter}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {task.estimated_minutes}m
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <CheckCircle2 className="h-4 w-4" />
                      P{task.priority}
                    </span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <StudyPlanGenerator />
        </div>

        <PomodoroTimer />
      </div>
    </div>
  );
}
