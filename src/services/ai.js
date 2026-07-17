import { fallbackRecipe, validateRecipe } from '../utils/validateRecipe.js';

const readError = async (response) => {
  const payload = await response.json().catch(() => null);
  return payload?.error || `Recipe generation failed (${response.status}).`;
};

/**
 * Requests a server-validated recipe. Secrets and provider-specific prompt logic
 * stay in the backend; the browser sends only the ingredient list.
 */
export async function generateRecipe(ingredients, { signal } = {}) {
  const response = await fetch('/api/recipe', {
    method: 'POST',
    signal,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ingredients }),
  });

  // A local demo remains usable without credentials. Any configured-provider
  // failure (rate limit, malformed output, timeout, etc.) still reaches the error UI.
  if (response.status === 503) return fallbackRecipe(ingredients);
  if (!response.ok) throw new Error(await readError(response));

  const payload = await response.json().catch(() => {
    throw new Error("Couldn't understand the AI response.");
  });

  if (payload?.status === 'insufficient_ingredients') return { status: payload.status, message: payload.message, suggestions: payload.suggestions };
  if (!payload?.recipe) throw new Error("Couldn't understand the AI response.");
  return validateRecipe(payload.recipe, ingredients);
}
