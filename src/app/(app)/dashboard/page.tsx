import Link from "next/link";
import { BarChart3, BrainCircuit, CalendarClock, Flame, Target, Timer } from "lucide-react";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { StudyTimeChart } from "@/components/charts/study-time-chart";
import { MetricCard } from "@/components/dashboard/metric-card";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardSnapshot } from "@/lib/data/queries";
import { formatHours } from "@/lib/utils";

export default async function DashboardPage() {
  const dashboard = await getDashboardSnapshot();

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Command center"
        title="Today is for compounding."
        description="Track study time, mistakes, revision streaks, weak subjects, and upcoming tests from one focused dashboard."
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href="/focus">
                <Timer className="h-4 w-4" aria-hidden="true" />
                Start focus
              </Link>
            </Button>
            <Button asChild>
              <Link href="/assistant">
                <BrainCircuit className="h-4 w-4" aria-hidden="true" />
                Ask AI
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          title="Daily study"
          value={formatHours(dashboard.dailyStudyHours)}
          detail={`${formatHours(dashboard.weeklyStudyHours)} this week`}
          icon={Timer}
        />
        <MetricCard
          title="Revision streak"
          value={`${dashboard.revisionStreak}d`}
          detail="No missed active-recall block"
          icon={Flame}
          tone="warning"
        />
        <MetricCard
          title="Open mistakes"
          value={`${dashboard.mistakeCount}`}
          detail="Prioritized by severity"
          icon={Target}
          tone="danger"
        />
        <MetricCard
          title="Productivity"
          value={`${dashboard.productivityScore}`}
          detail="Focus, consistency, recovery"
          icon={BarChart3}
          tone="success"
        />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Performance graph</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">Score trend against study rhythm.</p>
            </div>
            <Badge>Live loop</Badge>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={dashboard.performance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weak subjects</CardTitle>
            <p className="text-sm text-muted-foreground">AI priority stack for the next 72 hours.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboard.weakSubjects.map((subject, index) => (
              <div key={subject}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{subject}</span>
                  <span className="text-muted-foreground">{92 - index * 14}% risk</span>
                </div>
                <Progress value={92 - index * 14} />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Subject study hours</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyTimeChart data={dashboard.studyTime} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <CardTitle>Upcoming tests</CardTitle>
              <p className="text-sm text-muted-foreground">Revision tasks and mocks on deck.</p>
            </div>
            <CalendarClock className="h-5 w-5 text-primary" aria-hidden="true" />
          </CardHeader>
          <CardContent className="space-y-3">
            {dashboard.upcomingTests.map((test) => (
              <div
                key={`${test.title}-${test.date}`}
                className="flex items-center justify-between gap-4 rounded-md border border-border bg-secondary/25 p-3"
              >
                <div>
                  <p className="font-semibold">{test.title}</p>
                  <p className="text-sm text-muted-foreground">{test.subject}</p>
                </div>
                <Badge variant="secondary">{new Date(test.date).toLocaleDateString()}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
