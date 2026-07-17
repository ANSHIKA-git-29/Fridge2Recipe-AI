import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { FiMic, FiPlus } from 'react-icons/fi';

export default function IngredientInput({ onAdd }) {
  const [value, setValue] = useState('');
  const input = useRef();

  const add = () => {
    if (onAdd(value)) setValue('');
  };

  const voice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return toast.error('Voice input is not supported in this browser.');
    const recognition = new SpeechRecognition();
    recognition.lang = navigator.language || 'en-US';
    recognition.onresult = (event) => onAdd(event.results[0][0].transcript);
    recognition.onerror = () => toast.error('Voice input could not hear an ingredient.');
    recognition.start();
  };

  return <form onSubmit={(event) => { event.preventDefault(); add(); }} className="flex gap-2 rounded-2xl border border-black/5 bg-white p-2 shadow-sm dark:border-white/10 dark:bg-white/5">
    <input ref={input} id="ingredient-input" value={value} onChange={(event) => setValue(event.target.value)} className="min-w-0 flex-1 bg-transparent px-3 text-lg" placeholder="Try “eggs, spinach, feta”…" aria-label="Add ingredients" />
    <button type="button" className="icon-btn" onClick={voice} aria-label="Add ingredients with voice"><FiMic /></button>
    <button type="submit" className="btn-primary flex items-center gap-2 px-4"><FiPlus /> <span className="hidden sm:inline">Add</span></button>
  </form>;
}
