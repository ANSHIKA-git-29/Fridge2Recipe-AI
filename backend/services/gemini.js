const recipePrompt = (ingredients) => `You are an expert home chef. Create a practical recipe using the supplied ingredients.

Return ONLY valid JSON. Do not include markdown, commentary, or code fences.

Return exactly one of these JSON shapes:
{
  "status": "insufficient_ingredients",
  "message": "",
  "suggestions": [""]
}

OR, when the ingredients can realistically make a dish, use this exact schema:
{
  "recipeName": "",
  "description": "",
  "time": "",
  "difficulty": "",
  "servings": 2,
  "ingredients": [{ "name": "", "quantity": 1, "unit": "", "source": "user" }],
  "steps": [{ "title": "", "instruction": "", "time": "" }],
  "swaps": [{ "ingredient": "", "alternative": "" }],
  "nutrition": { "calories": "", "protein": "", "carbs": "", "fat": "" },
  "tips": [""]
}

Rules:
- Use only the listed ingredients.
- You may add only these pantry staples when needed: salt, black pepper, water, olive oil, cooking oil, butter, sugar, flour, dried herbs, mixed herbs.
- Any pantry staple must have "source": "pantry". Every listed ingredient must have "source": "user".
- Never invent another ingredient or silently substitute one.
- If the supplied ingredients cannot realistically make a dish or drink, return the insufficient_ingredients shape. Do not force a recipe.
- Recipe names must sound like a dish found on a cookbook or restaurant menu: specific, ingredient-led, and appetizing.
- Never use generic titles such as "Market Skillet", "Kitchen Bowl", "Garden Mix", "Fridge Meal", or "Pantry Plate" unless they are genuinely the established name of a dish.
- Never combine unrelated items in the title.

Ingredients available: ${ingredients.join(', ')}`;

export async function generateRecipeWithGemini(ingredients, { signal } = {}) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('Gemini API key is not configured.');
    error.status = 503;
    throw error;
  }

  const model = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(new Error('Gemini request timed out.')), 20_000);
  const abortFromCaller = () => controller.abort(signal?.reason || new Error('Request cancelled.'));
  signal?.addEventListener('abort', abortFromCaller, { once: true });

  let response;
  try {
    response = await fetch(endpoint, {
      method: 'POST',
      signal: controller.signal,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: recipePrompt(ingredients) }] }],
        generationConfig: { temperature: 0.45, responseMimeType: 'application/json' },
      }),
    });
  } catch (cause) {
    const error = new Error(signal?.aborted ? 'Recipe request cancelled.' : 'Gemini did not respond in time.');
    error.status = signal?.aborted ? 499 : 504;
    error.cause = cause;
    throw error;
  } finally {
    clearTimeout(timeout);
    signal?.removeEventListener('abort', abortFromCaller);
  }

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(payload.error?.message || 'Gemini could not generate a recipe.');
    error.status = response.status;
    throw error;
  }

  const content = payload.candidates?.[0]?.content?.parts?.map((part) => part.text || '').join('') || '';
  if (!content) {
    const error = new Error('Gemini returned an empty response.');
    error.status = 502;
    throw error;
  }

  return content;
}
