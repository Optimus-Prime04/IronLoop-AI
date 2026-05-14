import {
  BarChart3,
  Bot,
  Brain,
  CalendarClock,
  FileText,
  Gauge,
  History,
  LayoutDashboard,
  ListChecks,
  Target
} from "lucide-react";

export const appName = "IRONLOOP AI";

export const examTracks = ["CBSE", "JEE", "NEET", "SAT", "Olympiad", "Other"] as const;

export const coreSubjects = [
  "Physics",
  "Chemistry",
  "Mathematics",
  "Biology",
  "English",
  "Social Science",
  "Computer Science"
] as const;

export const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/planner", label: "Planner", icon: CalendarClock },
  { href: "/mistakes", label: "Mistakes", icon: Target },
  { href: "/assistant", label: "AI Tutor", icon: Bot },
  { href: "/notes", label: "Notes", icon: FileText },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/focus", label: "Focus", icon: Gauge },
  { href: "/profile", label: "Profile", icon: Brain }
] as const;

export const masteryLevels = [
  { value: "new", label: "New" },
  { value: "learning", label: "Learning" },
  { value: "reviewing", label: "Reviewing" },
  { value: "mastered", label: "Mastered" }
] as const;

export const severities = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" }
] as const;

export const assistantModes = [
  { value: "concept", label: "Explain concept", icon: Brain },
  { value: "quiz", label: "Generate quiz", icon: ListChecks },
  { value: "flashcards", label: "Flashcards", icon: History },
  { value: "ncert", label: "Simplify NCERT", icon: FileText },
  { value: "boards", label: "Board questions", icon: Target },
  { value: "revision", label: "Revision plan", icon: CalendarClock }
] as const;
