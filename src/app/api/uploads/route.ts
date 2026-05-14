import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient, getUser, isSupabaseServerConfigured } from "@/lib/supabase/server";

const schema = z.object({
  path: z.string().min(1)
});

export async function POST(request: Request) {
  if (!isSupabaseServerConfigured()) {
    return NextResponse.json({ error: "Supabase is not configured." }, { status: 503 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success || !parsed.data.path.startsWith(`${user.id}/`)) {
    return NextResponse.json({ error: "Invalid file path." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from("study-files")
    .createSignedUrl(parsed.data.path, 60 * 10);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
