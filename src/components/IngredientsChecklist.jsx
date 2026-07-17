import { FiCheck } from 'react-icons/fi';

export default function IngredientsChecklist({ ingredients, done, toggle }) {
  return <section aria-labelledby="ingredients-heading">
    <h2 id="ingredients-heading" className="mb-4 font-serif text-2xl">Ingredients</h2>
    <div className="grid gap-2 sm:grid-cols-2">{ingredients.map((item, index) => {
      const complete = done.includes(index);
      return <button type="button" onClick={() => toggle(index)} key={`${item.name}-${index}`} aria-pressed={complete} className={`glass flex items-center gap-3 rounded-xl p-3 text-left ${complete ? 'opacity-45 line-through' : ''}`}>
        <span aria-hidden="true" className={`grid h-5 w-5 place-items-center rounded-md border ${complete ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-black/20 dark:border-white/30'}`}>{complete && <FiCheck size={14} />}</span>
        <span className="flex-1 font-medium">{item.name}</span><span className="text-sm opacity-55">{item.quantity} {item.unit}</span>
      </button>;
    })}</div>
  </section>;
}
