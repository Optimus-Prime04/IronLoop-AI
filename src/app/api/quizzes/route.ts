import { NextResponse } from "next/server";
import { z } from "zod";
import { runStudyAI } from "@/lib/openai";
import { systemStudyCoach } from "@/lib/ai-prompts";

const quizSchema = z.object({
  subject: z.string().min(1),
  chapter: z.string().min(1),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  count: z.number().int().min(3).max(15).default(5)
});

export async function POST(request: Request) {
  const parsed = quizSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid quiz request." }, { status: 400 });
  }

  const { subject, chapter, difficulty, count } = parsed.data;

  try {
    const quiz = await runStudyAI({
      instructions: `${systemStudyCoach}
Generate ${count} ${difficulty} quiz questions for ${subject}: ${chapter}.
Return clean markdown with question, options, answer, explanation, and the exam skill being tested.`,
      input: `Subject: ${subject}\nChapter: ${chapter}\nDifficulty: ${difficulty}`,
      maxOutputTokens: 1600
    });

    return NextResponse.json({ quiz });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Quiz generation failed." },
      { status: 500 }
    );
  }
}
