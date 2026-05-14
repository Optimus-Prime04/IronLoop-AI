import { NextResponse } from "next/server";
import { z } from "zod";
import { plannerInstructions } from "@/lib/ai-prompts";
import { runStudyAI } from "@/lib/openai";

const plannerSchema = z.object({
  context: z.string().min(10).max(5000)
});

export async function POST(request: Request) {
  const parsed = plannerSchema.safeParse(await request.json());

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid planner request." }, { status: 400 });
  }

  try {
    const plan = await runStudyAI({
      instructions: plannerInstructions,
      input: parsed.data.context,
      maxOutputTokens: 1100
    });

    return NextResponse.json({ plan });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Planner request failed." },
      { status: 500 }
    );
  }
}
