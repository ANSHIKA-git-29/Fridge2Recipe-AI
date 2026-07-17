const pantryOnly = new Set(['salt', 'pepper', 'black pepper', 'oil', 'olive oil', 'water', 'sugar', 'flour', 'butter']);
const drinks = /tea|coffee|juice|smoothie|milkshake|cocoa/i;
const drinkPartners = /milk|lemon|ginger|mint|honey|sugar|ice|fruit|berry|cocoa/i;

export function assessIngredients(ingredients = []) {
  const values = ingredients.map((item) => String(item).trim()).filter(Boolean);
  const useful = values.filter((item) => !pantryOnly.has(item.toLowerCase()));
  const hasDrink = useful.some((item) => drinks.test(item));
  const hasDrinkPartner = useful.some((item) => drinkPartners.test(item));
  if (hasDrink && !hasDrinkPartner) return { sufficient: false, message: 'A drink needs one or two supporting ingredients to feel complete.', suggestions: ['Milk', 'Ginger', 'Lemon'] };
  if (useful.length < 2) return { sufficient: false, message: 'Not enough ingredients to create a meaningful recipe.', suggestions: hasDrink ? ['Milk', 'Ginger', 'Lemon'] : ['Onion', 'Eggs', 'Tomato'] };
  return { sufficient: true, message: '', suggestions: [] };
}
