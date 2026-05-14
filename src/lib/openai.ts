import OpenAI from "openai";

const defaultModel = process.env.OPENAI_MODEL || "gpt-5";

let cachedClient: OpenAI | null = null;

export function getOpenAIClient() {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  cachedClient ??= new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  return cachedClient;
}

export async function runStudyAI({
  instructions,
  input,
  maxOutputTokens = 1400
}: {
  instructions: string;
  input: string;
  maxOutputTokens?: number;
}) {
  const client = getOpenAIClient();

  const response = await client.responses.create({
    model: defaultModel,
    instructions,
    input,
    max_output_tokens: maxOutputTokens
  });

  return response.output_text?.trim() ?? "";
}

export function parseJsonFromModel<T>(raw: string): T {
  const fenced = raw.match(/```json\s*([\s\S]*?)```/i);
  const payload = fenced?.[1] ?? raw;
  return JSON.parse(payload) as T;
}
