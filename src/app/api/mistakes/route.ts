import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, getUser, isSupabaseServerConfigured } from "@/lib/supabase/server";

const mistakeSchema = z.object({
  subject: z.string().min(1),
  chapter: z.string().min(1),
  mistake: z.string().min(5),
  root_cause: z.string().min(5),
  correct_concept: z.string().min(5),
  severity: z.enum(["low", "medium", "high", "critical"]),
  mastery_level: z.enum(["new", "learning", "reviewing", "mastered"])
});

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json(
      { error: "Supabase is not configured. Add environment variables and run the SQL schema." },
      { status: 503 }
    );
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = mistakeSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid mistake payload." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("mistakes")
    .insert({
      ...parsed.data,
      user_id: user.id,
      mistake_date: new Date().toISOString().slice(0, 10),
      fixed: false,
      repeat_count: 1,
      tags: []
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ mistake: data });
}
