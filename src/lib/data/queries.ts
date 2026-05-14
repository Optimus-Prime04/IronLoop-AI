import { unstable_noStore as noStore } from "next/cache";
import { demoDashboard, demoFiles, demoMistakes, demoRevisionTasks } from "@/lib/data/demo";
import { getUser, isSupabaseServerConfigured, createClient } from "@/lib/supabase/server";
import type { DashboardSnapshot, Mistake, RevisionTask, UploadedFile } from "@/lib/types";

export async function getDashboardSnapshot(): Promise<DashboardSnapshot & { demoMode: boolean }> {
  noStore();

  if (!isSupabaseServerConfigured()) {
    return { ...demoDashboard, demoMode: true };
  }

  const user = await getUser();
  if (!user) {
    return { ...demoDashboard, demoMode: true };
  }

  const supabase = await createClient();
  const today = new Date().toISOString().slice(0, 10);

  const [{ data: sessions }, { data: mistakes }, { data: tasks }] = await Promise.all([
    supabase
      .from("study_sessions")
      .select("duration_minutes, focus_score, session_date, subject:subjects(name)")
      .eq("user_id", user.id)
      .gte("session_date", today),
    supabase.from("mistakes").select("subject, chapter, fixed, severity").eq("user_id", user.id),
    supabase
      .from("revision_tasks")
      .select("title, due_at, subject, status")
      .eq("user_id", user.id)
      .gte("due_at", new Date().toISOString())
      .order("due_at", { ascending: true })
      .limit(3)
  ]);

  const dailyMinutes = sessions?.reduce((sum, item) => sum + (item.duration_minutes ?? 0), 0) ?? 0;
  const openMistakes = mistakes?.filter((mistake) => !mistake.fixed) ?? [];
  const severityWeight = openMistakes.reduce((sum, mistake) => {
    const weights: Record<string, number> = { low: 1, medium: 2, high: 3, critical: 4 };
    return sum + (weights[mistake.severity] ?? 1);
  }, 0);

  return {
    ...demoDashboard,
    dailyStudyHours: dailyMinutes / 60,
    mistakeCount: openMistakes.length,
    weakSubjects: Array.from(new Set(openMistakes.map((mistake) => mistake.subject))).slice(0, 3),
    upcomingTests:
      tasks?.map((task) => ({
        title: task.title,
        date: task.due_at,
        subject: task.subject
      })) ?? demoDashboard.upcomingTests,
    productivityScore: Math.max(40, Math.min(99, 92 - severityWeight + Math.round(dailyMinutes / 30))),
    demoMode: false
  };
}

export async function getMistakes(): Promise<Mistake[]> {
  noStore();

  if (!isSupabaseServerConfigured()) {
    return demoMistakes;
  }

  const user = await getUser();
  if (!user) {
    return demoMistakes;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mistakes")
    .select("*")
    .eq("user_id", user.id)
    .order("mistake_date", { ascending: false });

  if (error || !data) {
    return demoMistakes;
  }

  return data as Mistake[];
}

export async function getRevisionTasks(): Promise<RevisionTask[]> {
  noStore();

  if (!isSupabaseServerConfigured()) {
    return demoRevisionTasks;
  }

  const user = await getUser();
  if (!user) {
    return demoRevisionTasks;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("revision_tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("due_at", { ascending: true });

  if (error || !data) {
    return demoRevisionTasks;
  }

  return data as RevisionTask[];
}

export async function getFiles(): Promise<UploadedFile[]> {
  noStore();

  if (!isSupabaseServerConfigured()) {
    return demoFiles;
  }

  const user = await getUser();
  if (!user) {
    return demoFiles;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("uploaded_files")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    return demoFiles;
  }

  return data as UploadedFile[];
}
