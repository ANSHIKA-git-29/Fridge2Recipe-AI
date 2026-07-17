import { FiArrowLeft, FiPlusCircle } from 'react-icons/fi';

export default function InsufficientIngredients({ detail, onAdd, onBack }) {
  return <div className="glass mx-auto max-w-xl rounded-[2rem] p-8 text-center sm:p-10"><span className="text-4xl" aria-hidden="true">🦊</span><h2 className="mt-4 font-serif text-3xl">Not enough ingredients to create a meaningful recipe.</h2><p className="mt-3 opacity-65">{detail?.message || 'Add a few more ingredients and Chef Fox will make a better suggestion.'}</p><div className="mt-6 flex flex-wrap justify-center gap-2">{(detail?.suggestions || []).map((item) => <button type="button" key={item} onClick={() => onAdd(item)} className="btn-secondary inline-flex items-center gap-2"><FiPlusCircle /> Add {item}</button>)}</div><button type="button" onClick={onBack} className="mt-7 inline-flex items-center gap-2 font-bold text-[#779500] hover:underline"><FiArrowLeft /> Continue editing ingredients</button></div>;
}
