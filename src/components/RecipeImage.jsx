const images = {
  pasta: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=85',
  chicken: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85',
  toast: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=900&q=85',
  soup: 'https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85',
  salad: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85',
};

export const recipeImageFor = (recipe) => {
  const text = `${recipe.recipeName} ${(recipe.sourceIngredients || []).join(' ')}`.toLowerCase();
  if (/tea|coffee|juice|smoothie|milkshake|drink|beverage/.test(text)) return null;
  if (/pasta|noodle|spaghetti|penne/.test(text)) return images.pasta;
  if (/chicken|steak|fish/.test(text)) return images.chicken;
  if (/toast|sandwich/.test(text)) return images.toast;
  if (/soup/.test(text)) return images.soup;
  if (/salad/.test(text)) return images.salad;
  return null;
};

export default function RecipeImage({ recipe }) {
  const src = recipeImageFor(recipe);
  if (!src) return null;
  return <div className="relative min-h-64 overflow-hidden rounded-3xl bg-black/10 md:min-h-full"><img src={src} alt={`${recipe.recipeName} plated and ready to eat`} className="absolute inset-0 h-full w-full object-cover" loading="eager" /><div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" /></div>;
}
