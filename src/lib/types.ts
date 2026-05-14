export type ExamTrack = "CBSE" | "JEE" | "NEET" | "SAT" | "Olympiad" | "Other";

export type Severity = "low" | "medium" | "high" | "critical";

export type MasteryLevel = "new" | "learning" | "reviewing" | "mastered";

export type RevisionStatus = "scheduled" | "in_progress" | "complete" | "missed";

export type Subject = {
  id: string;
  user_id: string;
  name: string;
  exam_track: ExamTrack;
  color: string;
  priority: number;
  created_at: string;
};

export type StudySession = {
  id: string;
  user_id: string;
  subject_id: string;
  subject_name: string;
  chapter: string | null;
  duration_minutes: number;
  focus_score: number;
  session_date: string;
  notes: string | null;
};

export type Mistake = {
  id: string;
  user_id: string;
  subject_id: string | null;
  subject: string;
  chapter: string;
  mistake: string;
  root_cause: string;
  correct_concept: string;
  severity: Severity;
  mastery_level: MasteryLevel;
  fixed: boolean;
  mistake_date: string;
  repeat_count: number;
  tags: string[];
  created_at: string;
};

export type Quiz = {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  difficulty: "easy" | "medium" | "hard";
  questions: QuizQuestion[];
  score: number | null;
  created_at: string;
};

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type UploadedFile = {
  id: string;
  user_id: string;
  name: string;
  storage_path: string;
  subject: string;
  chapter: string | null;
  tags: string[];
  file_kind: "notes" | "paper" | "solution" | "revision" | "other";
  size_bytes: number;
  created_at: string;
};

export type RevisionTask = {
  id: string;
  user_id: string;
  subject: string;
  chapter: string;
  title: string;
  due_at: string;
  status: RevisionStatus;
  priority: number;
  estimated_minutes: number;
};

export type AnalyticsPoint = {
  label: string;
  value: number;
  secondary?: number;
};

export type DashboardSnapshot = {
  dailyStudyHours: number;
  weeklyStudyHours: number;
  weakSubjects: string[];
  upcomingTests: Array<{ title: string; date: string; subject: string }>;
  revisionStreak: number;
  mistakeCount: number;
  productivityScore: number;
  performance: Array<{ day: string; score: number; studyHours: number }>;
  studyTime: AnalyticsPoint[];
  mistakeFrequency: AnalyticsPoint[];
};
