import { ArrowUpRight, Brain, Gauge, Target } from "lucide-react";
import { MistakeFrequencyChart } from "@/components/charts/mistake-frequency-chart";
import { PerformanceChart } from "@/components/charts/performance-chart";
import { StudyTimeChart } from "@/components/charts/study-time-chart";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getDashboardSnapshot } from "@/lib/data/queries";

export default async function AnalyticsPage() {
  const dashboard = await getDashboardSnapshot();

  const subjectPerformance = dashboard.studyTime.map((item) => ({
    label: item.label,
    value: item.secondary ?? 0
  }));

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Analytics"
        title="Measure the loop, then tighten it."
        description="Subject performance, weekly study time, mistake frequency, improvement rate, and predicted risk."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Improvement rate</p>
              <p className="mt-2 text-3xl font-black">+12.4%</p>
            </div>
            <ArrowUpRight className="h-6 w-6 text-success" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">Weak-topic risk</p>
              <p className="mt-2 text-3xl font-black">Medium</p>
            </div>
            <Target className="h-6 w-6 text-warning" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm text-muted-foreground">AI prediction</p>
              <p className="mt-2 text-3xl font-black">86%</p>
            </div>
            <Brain className="h-6 w-6 text-primary" />
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>Weekly study time and test score</CardTitle>
          </CardHeader>
          <CardContent>
            <PerformanceChart data={dashboard.performance} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mistake frequency</CardTitle>
          </CardHeader>
          <CardContent>
            <MistakeFrequencyChart data={dashboard.mistakeFrequency} />
            <div className="mt-2 grid gap-2">
              {dashboard.mistakeFrequency.map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <Badge variant="secondary">{item.value}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle>Subject-wise performance</CardTitle>
            <Gauge className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-4">
            {subjectPerformance.map((subject) => (
              <div key={subject.label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-semibold">{subject.label}</span>
                  <span className="text-muted-foreground">{subject.value}%</span>
                </div>
                <Progress value={subject.value} />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Subject study distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <StudyTimeChart data={dashboard.studyTime} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
