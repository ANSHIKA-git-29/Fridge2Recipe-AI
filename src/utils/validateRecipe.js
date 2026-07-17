const fallback = { recipeName: 'Golden Fridge Frittata', description: 'A cozy skillet meal made from what you have on hand.', time: '25 min', difficulty: 'Easy', servings: 2, ingredients: [{ name: 'Eggs', quantity: 4, unit: '' }], steps: [{ title: 'Prep your ingredients', instruction: 'Wash, slice, and arrange everything before cooking.', time: '5 min' }], swaps: [], nutrition: { calories: '360 kcal', protein: '24g', carbs: '10g', fat: '25g' }, tips: ['Keep the heat low for a tender finish.'] };

export const fallbackRecipe = (ingredients = []) => {
  if (!ingredients.length) return fallback;
  const names = ingredients.map(String);
  const primary = names[0];
  const second = names[1] || 'vegetables';
  const all = names.join(', ');
  const has = (word) => names.some((name) => name.toLowerCase().includes(word));
  const isBeverage = has('tea') || has('coffee') || has('juice') || has('smoothie') || has('milkshake') || has('cocoa');
  const vegetable = names.find((name) => /capsicum|pepper|spinach|tomato|onion|mushroom|broccoli|carrot|zucchini/i.test(name));
  const style = has('pasta') || has('noodle') ? 'Pasta' : has('rice') ? 'Rice Bowl' : has('chicken') || has('fish') ? 'One-Pan Supper' : has('bread') ? 'Toast' : 'Skillet';
  const drinkName = has('coffee') ? 'Freshly Brewed Coffee' : has('cocoa') ? 'Cozy Hot Cocoa' : has('juice') ? 'Fresh Fruit Juice' : has('smoothie') ? 'Creamy Fruit Smoothie' : has('milkshake') ? 'Classic Milkshake' : 'Freshly Brewed Tea';
  const recipeName = isBeverage ? drinkName : has('egg') && vegetable ? `${vegetable} & Egg Skillet` : has('pasta') || has('noodle') ? `${primary} Pasta` : has('chicken') ? `One-Pan Chicken with ${second}` : has('potato') ? `Crispy Potato & ${second} Skillet` : has('bread') ? `${primary} & ${second} Toast` : has('cheese') && vegetable ? `Cheesy ${vegetable} Skillet` : `${primary} & ${second} ${style}`;
  return {
    ...fallback,
    recipeName,
    description: isBeverage ? `A simple, comforting drink made with ${all}.` : `A simple, satisfying ${style.toLowerCase()} made with ${all}.`,
    time: `${20 + Math.min(names.length * 3, 20)} min`,
    ingredients: names.map((name, index) => ({ name, quantity: index === 0 ? 2 : 1, unit: index === 0 ? '' : 'medium' })),
    steps: isBeverage ? [
      { title: 'Prepare your drink', instruction: `Set out ${all} and a clean cup or glass.`, time: '2 min' },
      { title: 'Brew or blend', instruction: 'Prepare the drink according to the ingredients, then stir or blend until smooth.', time: '5 min' },
      { title: 'Serve', instruction: 'Taste, adjust to your preference, and serve fresh.', time: '1 min' },
    ] : [
      { title: 'Prep your ingredients', instruction: `Wash, slice, and arrange ${all} so everything is ready to cook.`, time: '5 min' },
      { title: `Build the ${style.toLowerCase()}`, instruction: `Heat a little oil in a pan and cook ${primary}${names.length > 1 ? `, then add ${names.slice(1).join(', ')}` : ''} until fragrant and tender.`, time: '8 min' },
      { title: 'Season and bring together', instruction: 'Season to taste with salt, pepper, and any herbs you enjoy.', time: '5 min' },
      { title: 'Finish and serve', instruction: 'Cook until hot and lightly golden, then serve straight away.', time: '5 min' },
    ],
    swaps: [{ ingredient: primary, alternative: has('chicken') ? 'Tofu' : has('cheese') ? 'Paneer' : 'A similar seasonal ingredient' }, { ingredient: second, alternative: 'Any similar ingredient you have' }],
    nutrition: { calories: `${280 + names.length * 45} kcal`, protein: `${10 + names.length * 3}g`, carbs: `${18 + names.length * 4}g`, fat: `${9 + names.length * 2}g` },
    tips: [`Taste after adding ${primary}; it is the star of this recipe.`, `This recipe adapts to the ${names.length} ingredients you selected.`],
  };
};

export function validateRecipe(data, fallbackIngredients = []) {
  if (!data || typeof data !== 'object') throw new Error('Invalid recipe');
  const base = fallbackRecipe(fallbackIngredients);
  const beverageInput = fallbackIngredients.some((ingredient) => /tea|coffee|juice|smoothie|milkshake|cocoa/i.test(String(ingredient)));
  return { ...base, ...data, recipeName: beverageInput ? base.recipeName : data.recipeName || base.recipeName, description: beverageInput ? base.description : data.description || base.description, steps: beverageInput ? base.steps : Array.isArray(data.steps) && data.steps.length ? data.steps.map((step, index) => ({ title: String(step.title || `Step ${index + 1}`), instruction: String(step.instruction || ''), time: String(step.time || '') })) : base.steps, servings: Number(data.servings) > 0 ? Number(data.servings) : base.servings, ingredients: Array.isArray(data.ingredients) && data.ingredients.length ? data.ingredients.map((item) => ({ name: String(item.name || 'Ingredient'), quantity: Number(item.quantity) || 1, unit: String(item.unit || '') })) : base.ingredients, swaps: Array.isArray(data.swaps) ? data.swaps : base.swaps, tips: Array.isArray(data.tips) ? data.tips : base.tips, nutrition: { ...base.nutrition, ...(data.nutrition || {}) } };
}
