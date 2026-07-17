import { FiMinus, FiPlus } from 'react-icons/fi';

export default function ServingScaler({ servings, setServings }) {
  return <div className="flex items-center gap-3 rounded-xl bg-black/5 p-2 dark:bg-white/10" aria-label="Serving size">
    <button type="button" onClick={() => setServings(Math.max(1, servings - 1))} aria-label="Decrease servings" className="icon-btn h-8 w-8"><FiMinus /></button>
    <span className="w-20 text-center text-sm font-bold" aria-live="polite">{servings} servings</span>
    <button type="button" onClick={() => setServings(Math.min(20, servings + 1))} aria-label="Increase servings" className="icon-btn h-8 w-8"><FiPlus /></button>
  </div>;
}
