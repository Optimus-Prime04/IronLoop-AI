import { Download, FileText, Search } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { UploadPanel } from "@/components/notes/upload-panel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getFiles } from "@/lib/data/queries";

export default async function NotesPage() {
  const files = await getFiles();

  return (
    <div className="animate-fade-up">
      <PageHeader
        eyebrow="PDF + notes"
        title="One vault for papers, notes, and revision sheets."
        description="Upload PDFs, tag chapters, organize previous papers, and keep every correction searchable."
      />

      <div className="grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>Study vault</CardTitle>
            <div className="relative mt-3 max-w-xl">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input className="pl-9" placeholder="Search files, tags, chapters" />
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="grid gap-3 rounded-lg border border-border bg-secondary/25 p-4 md:grid-cols-[1fr_auto]"
              >
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md border border-primary/30 bg-primary/10 text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-semibold">{file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {file.subject}
                      {file.chapter ? ` - ${file.chapter}` : ""}
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {file.tags.map((tag) => (
                        <Badge key={tag} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button variant="outline" size="icon" aria-label={`Download ${file.name}`} title="Download">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <UploadPanel />
      </div>
    </div>
  );
}
