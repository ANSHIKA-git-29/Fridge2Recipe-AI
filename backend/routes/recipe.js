import { Router } from 'express';
import { generateRecipeWithGemini } from '../services/gemini.js';

const router = Router();

function extractJSON(value) {
  const text = String(value || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('No JSON object was found in the AI response.');
  return JSON.parse(text.slice(start, end + 1));
}

const PANTRY_STAPLES = new Set(['salt', 'black pepper', 'pepper', 'water', 'olive oil', 'cooking oil', 'butter', 'sugar', 'flour', 'dried herbs', 'mixed herbs']);
const normalizeName = (value) => String(value || '').trim().toLowerCase();
const isGenericTitle = (value) => /\b(market|kitchen|garden|fridge|pantry)\s+(skillet|bowl|mix|meal|plate|supper)\b/i.test(String(value));
const cookbookTitle = (ingredients) => {
  const first = ingredients[0] || 'Seasonal';
  const second = ingredients[1] || 'Vegetable';
  const has = (word) => ingredients.some((item) => normalizeName(item).includes(word));
  const vegetable = ingredients.find((item) => /capsicum|pepper|spinach|tomato|onion|mushroom|broccoli|carrot|zucchini/i.test(item));
  if (has('egg') && vegetable) return `Soft Eggs with ${vegetable}`;
  if (has('pasta') || has('noodle')) return `${second === 'Pasta' ? 'Simple' : second} Pasta`;
  if (has('chicken')) return `Pan-Roasted Chicken with ${second}`;
  if (has('potato')) return `Crispy Potato and ${second} Hash`;
  if (has('bread')) return `Open-Faced ${second} Toast`;
  if (has('cheese') && vegetable) return `Cheesy ${vegetable} Saute`;
  return `${first} and ${second} Saute`;
};
const isInsufficient = (ingredients) => {
  const useful = ingredients.filter((item) => !PANTRY_STAPLES.has(normalizeName(item)));
  const hasDrink = useful.some((item) => /tea|coffee|juice|smoothie|milkshake|cocoa/i.test(item));
  const partner = useful.some((item) => /milk|lemon|ginger|mint|honey|sugar|ice|fruit|berry|cocoa/i.test(item));
  if (hasDrink && !partner) return { status: 'insufficient_ingredients', message: 'A drink needs one or two supporting ingredients to feel complete.', suggestions: ['Milk', 'Ginger', 'Lemon'] };
  if (useful.length < 2) return { status: 'insufficient_ingredients', message: 'Not enough ingredients to create a meaningful recipe.', suggestions: ['Onion', 'Eggs', 'Tomato'] };
  return null;
};

function normalizeRecipe(value, requestedIngredients) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new Error('The AI response has the wrong shape.');
  if (!value.recipeName || !Array.isArray(value.ingredients) || !Array.isArray(value.steps) || !value.ingredients.length || !value.steps.length) {
    throw new Error('The AI response is missing required recipe fields.');
  }

  const requested = new Map(requestedIngredients.map((ingredient) => [normalizeName(ingredient), ingredient]));
  const invalidIngredients = [];
  const ingredients = value.ingredients.slice(0, 25).flatMap((item) => {
    const name = normalizeName(item?.name);
    const source = String(item?.source || 'user').toLowerCase();
    const isRequested = requested.has(name);
    const isLabeledPantryStaple = source === 'pantry' && PANTRY_STAPLES.has(name);
    if (!isRequested && !isLabeledPantryStaple) { invalidIngredients.push(String(item?.name || 'unknown')); return []; }
    return [{
      name: isRequested ? requested.get(name) : String(item.name).trim(),
      quantity: Math.max(0.25, Number(item?.quantity) || 1),
      unit: String(item?.unit || ''),
      source: isLabeledPantryStaple ? 'pantry' : 'user',
    }];
  });
  if (invalidIngredients.length) throw new Error(`The AI introduced unsupported ingredients: ${invalidIngredients.join(', ')}`);

  // The model may omit a submitted item. Preserve it in the rendered recipe
  // rather than silently replacing it with an unrelated ingredient.
  for (const requestedIngredient of requestedIngredients) {
    if (!ingredients.some((ingredient) => normalizeName(ingredient.name) === normalizeName(requestedIngredient))) {
      ingredients.push({ name: requestedIngredient, quantity: 1, unit: '', source: 'user' });
    }
  }

  return {
    recipeName: isGenericTitle(value.recipeName) ? cookbookTitle(requestedIngredients) : String(value.recipeName).slice(0, 100),
    description: String(value.description || 'A flexible recipe built from your available ingredients.'),
    time: String(value.time || '30 min'),
    difficulty: String(value.difficulty || 'Easy'),
    servings: Math.max(1, Number(value.servings) || 2),
    ingredients,
    steps: value.steps.slice(0, 12).map((step, index) => ({
      title: String(step?.title || `Step ${index + 1}`),
      instruction: String(step?.instruction || 'Cook until heated through.'),
      time: String(step?.time || ''),
    })),
    swaps: Array.isArray(value.swaps) ? value.swaps.slice(0, 8).map((swap) => ({ ingredient: String(swap?.ingredient || ''), alternative: String(swap?.alternative || '') })) : [],
    nutrition: {
      calories: String(value.nutrition?.calories || '-'),
      protein: String(value.nutrition?.protein || '-'),
      carbs: String(value.nutrition?.carbs || '-'),
      fat: String(value.nutrition?.fat || '-'),
    },
    tips: Array.isArray(value.tips) ? value.tips.slice(0, 6).map(String) : [],
  };
}

router.post('/', async (req, res) => {
  const ingredients = Array.isArray(req.body?.ingredients) ? req.body.ingredients.map((item) => String(item).trim()).filter(Boolean) : [];
  if (!ingredients.length) return res.status(400).json({ error: 'Add at least one ingredient.' });
  if (ingredients.length > 20) return res.status(400).json({ error: 'You can add up to 20 ingredients.' });
  const insufficient = isInsufficient(ingredients);
  if (insufficient) return res.json(insufficient);

  const controller = new AbortController();
  const abortRequest = () => controller.abort(new Error('Client disconnected.'));
  req.once('aborted', abortRequest);

  try {
    const content = await generateRecipeWithGemini(ingredients, { signal: controller.signal });
    const response = extractJSON(content);
    if (response?.status === 'insufficient_ingredients') return res.json({ status: 'insufficient_ingredients', message: String(response.message || 'Not enough ingredients to create a meaningful recipe.'), suggestions: Array.isArray(response.suggestions) ? response.suggestions.slice(0, 4).map(String) : ['Onion', 'Eggs', 'Tomato'] });
    return res.json({ recipe: normalizeRecipe(response, ingredients) });
  } catch (error) {
    if (controller.signal.aborted || res.headersSent) return;
    const status = error.status || 422;
    const safeMessage = status === 422 ? "Couldn't understand the AI response." : status === 429 ? 'The recipe service is busy. Please try again shortly.' : status === 503 ? 'AI generation is not configured yet.' : status >= 500 ? 'The recipe service is temporarily unavailable. Please try again.' : 'Unable to generate a recipe.';
    return res.status(status).json({ error: safeMessage });
  } finally {
    req.removeListener('aborted', abortRequest);
  }
});

export default router;
