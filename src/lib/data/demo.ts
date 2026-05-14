import type { DashboardSnapshot, Mistake, RevisionTask, UploadedFile } from "@/lib/types";

export const demoDashboard: DashboardSnapshot = {
  dailyStudyHours: 5.5,
  weeklyStudyHours: 32,
  weakSubjects: ["Physics", "Organic Chemistry", "Calculus"],
  upcomingTests: [
    { title: "JEE Main Mock 08", date: "2026-05-17", subject: "Full syllabus" },
    { title: "CBSE Physics Board Drill", date: "2026-05-19", subject: "Physics" },
    { title: "NEET Bio NCERT Line Test", date: "2026-05-21", subject: "Biology" }
  ],
  revisionStreak: 14,
  mistakeCount: 38,
  productivityScore: 87,
  performance: [
    { day: "Mon", score: 68, studyHours: 4.5 },
    { day: "Tue", score: 72, studyHours: 5 },
    { day: "Wed", score: 71, studyHours: 4 },
    { day: "Thu", score: 77, studyHours: 5.5 },
    { day: "Fri", score: 81, studyHours: 6 },
    { day: "Sat", score: 83, studyHours: 4.5 },
    { day: "Sun", score: 86, studyHours: 3 }
  ],
  studyTime: [
    { label: "Physics", value: 11, secondary: 76 },
    { label: "Chemistry", value: 8, secondary: 72 },
    { label: "Maths", value: 9, secondary: 82 },
    { label: "Biology", value: 4, secondary: 88 }
  ],
  mistakeFrequency: [
    { label: "Concept gap", value: 14 },
    { label: "Calculation", value: 9 },
    { label: "NCERT line", value: 7 },
    { label: "Time pressure", value: 5 },
    { label: "Silly error", value: 3 }
  ]
};

export const demoMistakes: Mistake[] = [
  {
    id: "m1",
    user_id: "demo",
    subject_id: null,
    subject: "Physics",
    chapter: "Current Electricity",
    mistake: "Used series resistance formula for a parallel branch in a mixed circuit.",
    root_cause: "Did not redraw equivalent circuit before substituting values.",
    correct_concept: "Reduce parallel branches first, then combine with series elements.",
    severity: "critical",
    mastery_level: "reviewing",
    fixed: false,
    mistake_date: "2026-05-12",
    repeat_count: 3,
    tags: ["circuit", "concept"],
    created_at: "2026-05-12T10:00:00Z"
  },
  {
    id: "m2",
    user_id: "demo",
    subject_id: null,
    subject: "Chemistry",
    chapter: "Aldehydes and Ketones",
    mistake: "Confused Tollens and Fehling selectivity for aromatic aldehydes.",
    root_cause: "Memorized reagent outcomes without mechanism or exceptions.",
    correct_concept: "Tollens oxidizes aromatic aldehydes; Fehling generally does not.",
    severity: "high",
    mastery_level: "learning",
    fixed: false,
    mistake_date: "2026-05-10",
    repeat_count: 2,
    tags: ["organic", "reagents"],
    created_at: "2026-05-10T10:00:00Z"
  },
  {
    id: "m3",
    user_id: "demo",
    subject_id: null,
    subject: "Mathematics",
    chapter: "Definite Integration",
    mistake: "Missed symmetry shortcut and spent six minutes on expansion.",
    root_cause: "Pattern recognition under time pressure is weak.",
    correct_concept: "Check f(a + b - x) before choosing a brute-force method.",
    severity: "medium",
    mastery_level: "mastered",
    fixed: true,
    mistake_date: "2026-05-09",
    repeat_count: 1,
    tags: ["time", "shortcut"],
    created_at: "2026-05-09T10:00:00Z"
  }
];

export const demoRevisionTasks: RevisionTask[] = [
  {
    id: "r1",
    user_id: "demo",
    subject: "Physics",
    chapter: "Current Electricity",
    title: "Redo 12 mixed-circuit questions",
    due_at: "2026-05-15T18:00:00Z",
    status: "scheduled",
    priority: 5,
    estimated_minutes: 45
  },
  {
    id: "r2",
    user_id: "demo",
    subject: "Chemistry",
    chapter: "Aldehydes and Ketones",
    title: "Reagent exception flashcards",
    due_at: "2026-05-16T16:00:00Z",
    status: "scheduled",
    priority: 4,
    estimated_minutes: 30
  },
  {
    id: "r3",
    user_id: "demo",
    subject: "Mathematics",
    chapter: "Definite Integration",
    title: "Symmetry drill, 20-minute sprint",
    due_at: "2026-05-16T19:00:00Z",
    status: "in_progress",
    priority: 3,
    estimated_minutes: 25
  }
];

export const demoFiles: UploadedFile[] = [
  {
    id: "f1",
    user_id: "demo",
    name: "JEE Main Mock 08 Analysis.pdf",
    storage_path: "demo/mock-08-analysis.pdf",
    subject: "Full syllabus",
    chapter: null,
    tags: ["mock", "analysis"],
    file_kind: "paper",
    size_bytes: 824000,
    created_at: "2026-05-12T09:00:00Z"
  },
  {
    id: "f2",
    user_id: "demo",
    name: "NCERT Bio Biomolecules Notes.pdf",
    storage_path: "demo/biomolecules-ncert.pdf",
    subject: "Biology",
    chapter: "Biomolecules",
    tags: ["ncert", "revision"],
    file_kind: "notes",
    size_bytes: 412000,
    created_at: "2026-05-11T09:00:00Z"
  }
];
