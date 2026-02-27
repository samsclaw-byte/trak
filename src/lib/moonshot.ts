/**
 * Call Moonshot/Kimi API to estimate nutrition for a food description.
 * Requires MOONSHOT_API_KEY in env. Model can be set via MOONSHOT_MODEL (default kimi-k2-turbo-preview).
 */

const MOONSHOT_BASE = "https://api.moonshot.ai/v1";

export type NutritionResult = {
  calories: number;
  fat: number;
  protein: number;
  carbs: number;
  sugars: number;
  fibre: number;
};

const NUTRITION_SYSTEM = `You are a nutrition assistant. Given a short description of a meal or food, respond with estimated nutrition values.
Reply with ONLY a valid JSON object, no other text. Use this exact shape (numbers only):
{"calories": <number>, "fat": <number>, "protein": <number>, "carbs": <number>, "sugars": <number>, "fibre": <number>}
Round calories to the nearest integer; round other values to one decimal place. If a value is unknown, use 0. Be concise.`;

export async function getNutritionForMeal(description: string): Promise<NutritionResult> {
  const apiKey = process.env.MOONSHOT_API_KEY;
  if (!apiKey) {
    throw new Error("MOONSHOT_API_KEY is not set");
  }
  const model = process.env.MOONSHOT_MODEL ?? "kimi-k2-turbo-preview";

  const res = await fetch(`${MOONSHOT_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: NUTRITION_SYSTEM },
        { role: "user", content: description.trim() || "Unknown meal" },
      ],
      temperature: 0.2,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Moonshot API error: ${res.status} ${err}`);
  }

  const data = (await res.json()) as { choices?: Array<{ message?: { content?: string } }> };
  const content = data.choices?.[0]?.message?.content?.trim();
  if (!content) {
    throw new Error("Empty response from Moonshot");
  }

  let raw = content;
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (jsonMatch) raw = jsonMatch[0];
  const parsed = JSON.parse(raw) as Record<string, unknown>;
  return {
    calories: Number(parsed.calories) || 0,
    fat: Number(parsed.fat) ?? 0,
    protein: Number(parsed.protein) ?? 0,
    carbs: Number(parsed.carbs) ?? 0,
    sugars: Number(parsed.sugars) ?? 0,
    fibre: Number(parsed.fibre) ?? 0,
  };
}
