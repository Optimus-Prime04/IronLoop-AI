import { AssistantConsole } from "@/components/assistant/assistant-console";
import { PageHeader } from "@/components/layout/page-header";

export default function AssistantPage() {
  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="AI tutor"
        title="Ask with context, revise with precision."
        description="Generate explanations, quizzes, flashcards, NCERT simplifications, board-style questions, and revision recommendations."
      />
      <AssistantConsole />
    </div>
  );
}
