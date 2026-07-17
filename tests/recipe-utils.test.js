import test from 'node:test';
import assert from 'node:assert/strict';
import { extractJSON } from '../src/utils/extractJSON.js';
import { fallbackRecipe, validateRecipe } from '../src/utils/validateRecipe.js';
import { scaleIngredients } from '../src/utils/scaleIngredients.js';
import { generateRecipe } from '../src/services/ai.js';

const recipePayload = { recipe: { recipeName: 'Tomato Eggs', ingredients: [{ name: 'Tomato', quantity: 1 }], steps: [{ title: 'Cook', instruction: 'Cook gently.' }] } };
const withFetch = async (mock, run) => {
  const original = globalThis.fetch;
  globalThis.fetch = mock;
  try { await run(); } finally { globalThis.fetch = original; }
};

test('extractJSON handles code fences and surrounding text', () => {
  assert.deepEqual(extractJSON('Here you go\n```json\n{"recipeName":"Soup"}\n```'), { recipeName: 'Soup' });
});

test('extractJSON rejects output without an object', () => {
  assert.throws(() => extractJSON('not JSON'), /No JSON object found/);
});

test('validateRecipe supplies safe defaults for partial model output', () => {
  const recipe = validateRecipe({ recipeName: 'Tomato Toast', ingredients: [{ name: 'Tomato' }], steps: [{ title: 'Toast' }] }, ['Tomato']);
  assert.equal(recipe.servings, 2);
  assert.equal(recipe.ingredients[0].quantity, 1);
  assert.equal(recipe.steps[0].instruction, '');
  assert.equal(recipe.nutrition.calories, '325 kcal');
});

test('fallbackRecipe adapts to supplied ingredients', () => {
  const recipe = fallbackRecipe(['Potato', 'Peas']);
  assert.match(recipe.recipeName, /Potato/);
  assert.deepEqual(recipe.ingredients.map((item) => item.name), ['Potato', 'Peas']);
});

test('scaleIngredients scales quantities without mutating inputs', () => {
  const ingredients = [{ name: 'Rice', quantity: 1, unit: 'cup' }];
  assert.deepEqual(scaleIngredients(ingredients, 2, 4), [{ name: 'Rice', quantity: 2, unit: 'cup' }]);
  assert.equal(ingredients[0].quantity, 1);
});

test('recipe client sends the exact submitted ingredients', async () => {
  await withFetch(async (_url, options) => {
    assert.deepEqual(JSON.parse(options.body).ingredients, ['Eggs', 'Tomato', 'Capsicum']);
    return new Response(JSON.stringify(recipePayload), { status: 200 });
  }, async () => {
    const recipe = await generateRecipe(['Eggs', 'Tomato', 'Capsicum']);
    assert.equal(recipe.recipeName, 'Tomato Eggs');
  });
});

test('recipe client rejects empty and wrong-schema responses safely', async () => {
  await withFetch(async () => new Response(JSON.stringify({}), { status: 200 }), async () => {
    await assert.rejects(() => generateRecipe(['Eggs']), /Couldn't understand/);
  });
  await withFetch(async () => new Response('', { status: 200 }), async () => {
    await assert.rejects(() => generateRecipe(['Eggs']), /Couldn't understand/);
  });
});

test('recipe client rejects invalid JSON and network failures safely', async () => {
  await withFetch(async () => new Response('not JSON', { status: 200 }), async () => {
    await assert.rejects(() => generateRecipe(['Eggs']), /Couldn't understand/);
  });
  await withFetch(async () => { throw new TypeError('Network failed'); }, async () => {
    await assert.rejects(() => generateRecipe(['Eggs']), /Network failed/);
  });
});

test('aborting an older request prevents it from producing a recipe', async () => {
  await withFetch((_url, options) => new Promise((_resolve, reject) => {
    options.signal.addEventListener('abort', () => reject(new DOMException('Aborted', 'AbortError')), { once: true });
  }), async () => {
    const controller = new AbortController();
    const pending = generateRecipe(['Eggs'], { signal: controller.signal });
    controller.abort();
    await assert.rejects(pending, { name: 'AbortError' });
  });
});
