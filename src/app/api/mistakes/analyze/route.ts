import { NextResponse } from "next/server";
import { z } from "zod";
import { mistakeAnalysisInstructions } from "@/lib/ai-prompts";
import { runStudyAI } from "@/lib/openai";

const schema = z.object({
  mistakes: z
    .array(
      z.object({
        subject: z.string(),
        chapter: z.string(),
        mistake: z.string(),
        root_cause: z.string(),
        correct_concept: z.string(),
        severity: z.string(),
        repeat_count: z.number().optional()
      })
    )
    .min(1)
    .max(30)
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mistake analysis request." }, { status: 400 });
  }

  try {
    const analysis = await runStudyAI({
      instructions: mistakeAnalysisInstructions,
      input: JSON.stringify(parsed.data.mistakes, null, 2),
      maxOutputTokens: 1200
    });

    return NextResponse.json({ analysis });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mistake analysis failed." },
      { status: 500 }
    );
  }
}
