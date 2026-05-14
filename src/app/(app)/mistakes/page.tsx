import { PageHeader } from "@/components/layout/page-header";
import { MistakeWorkbench } from "@/components/mistakes/mistake-workbench";
import { Button } from "@/components/ui/button";
import { getMistakes } from "@/lib/data/queries";
import { Upload } from "lucide-react";

export default async function MistakesPage() {
  const mistakes = await getMistakes();

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="Mistake tracker"
        title="Every error becomes a system."
        description="Capture mistakes, root causes, corrections, mastery level, repeat signals, and AI recommendations."
        actions={
          <Button variant="outline">
            <Upload className="h-4 w-4" />
            Import test
          </Button>
        }
      />
      <MistakeWorkbench initialMistakes={mistakes} />
    </div>
  );
}
