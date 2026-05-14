"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createClient, isSupabaseBrowserConfigured } from "@/lib/supabase/client";

export function UploadPanel() {
  const [file, setFile] = useState<File | null>(null);
  const [subject, setSubject] = useState("Physics");
  const [chapter, setChapter] = useState("");
  const [tags, setTags] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!file) {
      setError("Choose a PDF or note file first.");
      return;
    }

    if (!isSupabaseBrowserConfigured()) {
      setError("Add Supabase environment variables to enable storage uploads.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      setError("Login is required to upload files.");
      return;
    }

    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const storagePath = `${user.id}/${Date.now()}-${safeName}`;
    const upload = await supabase.storage.from("study-files").upload(storagePath, file, {
      cacheControl: "3600",
      upsert: false
    });

    if (upload.error) {
      setLoading(false);
      setError(upload.error.message);
      return;
    }

    const insert = await supabase.from("uploaded_files").insert({
      user_id: user.id,
      name: file.name,
      storage_path: storagePath,
      subject,
      chapter: chapter || null,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
      file_kind: "notes",
      size_bytes: file.size
    });

    setLoading(false);

    if (insert.error) {
      setError(insert.error.message);
      return;
    }

    setFile(null);
    setMessage("File uploaded and indexed.");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload notes</CardTitle>
        <p className="text-sm text-muted-foreground">Store PDFs, papers, solutions, and revision sheets in Supabase Storage.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={uploadFile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file">File</Label>
            <Input
              id="file"
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="note-subject">Subject</Label>
              <Input
                id="note-subject"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-chapter">Chapter</Label>
              <Input
                id="note-chapter"
                value={chapter}
                onChange={(event) => setChapter(event.target.value)}
                placeholder="Optional"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(event) => setTags(event.target.value)}
              placeholder="ncert, mock, formula"
            />
          </div>
          {error ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}
          {message ? (
            <p className="rounded-md border border-success/30 bg-success/10 px-3 py-2 text-sm text-success">
              {message}
            </p>
          ) : null}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
            Upload
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
