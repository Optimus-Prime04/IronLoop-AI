import { NextResponse } from "next/server";
import { z } from "zod";
import { buildAssistantInstructions } from "@/lib/ai-prompts";
import { runStudyAI } from "@/lib/openai";

const requestSchema = z.object({
  mode: z.enum(["concept", "quiz", "flashcards", "ncert", "boards", "revision"]),
  message: z.string().min(3).max(6000)
});

export async function POST(request: Request) {
  const parsed = requestSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid assistant request." }, { status: 400 });
  }

  try {
    const answer = await runStudyAI({
      instructions: buildAssistantInstructions(parsed.data.mode),
      input: parsed.data.message
    });

    return NextResponse.json({ answer });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "AI request failed." },
      { status: 500 }
    );
  }
}
