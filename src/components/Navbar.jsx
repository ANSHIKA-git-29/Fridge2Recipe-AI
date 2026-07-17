import { useState } from 'react';
import { FiBookmark, FiMenu, FiX } from 'react-icons/fi';
import ThemeToggle from './ThemeToggle';

const links = [
  ['home', 'Home'],
  ['community', 'Community recipes'],
  ['blog', 'Blog'],
  ['submit', 'Submit recipe'],
];

export default function Navbar({ page, setPage, dark, setDark }) {
  const [open, setOpen] = useState(false);
  const visit = (next) => { setPage(next); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); };
  return <header className="sticky top-0 z-40 border-b border-[#26351e]/10 bg-[#fffaf5]/85 backdrop-blur-xl dark:bg-[#171513]/85">
    <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4" aria-label="Main navigation">
      <button type="button" onClick={() => visit('home')} className="flex items-center gap-3 text-xl font-bold tracking-tight">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-[#ff9c1a] to-[#ff6b1a] text-2xl shadow-lg shadow-orange/20" aria-hidden="true">🦊</span>
        <span>Fridge<span className="text-[#779500]">2</span>Recipe</span>
      </button>
      <div className="hidden items-center gap-1 lg:flex">
        {links.map(([key, label]) => <button type="button" key={key} onClick={() => visit(key)} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${page === key ? 'bg-[#e8e5d4] text-[#526700] dark:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'}`}>{label}</button>)}
        <button type="button" onClick={() => visit('saved')} className="icon-btn ml-1" aria-label="Saved recipes"><FiBookmark /></button>
        <ThemeToggle dark={dark} setDark={setDark} />
      </div>
      <div className="flex items-center gap-1 lg:hidden"><button type="button" onClick={() => visit('saved')} className="icon-btn" aria-label="Saved recipes"><FiBookmark /></button><ThemeToggle dark={dark} setDark={setDark} /><button type="button" onClick={() => setOpen((value) => !value)} className="icon-btn" aria-label="Toggle navigation" aria-expanded={open}>{open ? <FiX /> : <FiMenu />}</button></div>
    </nav>
    {open && <div className="border-t border-black/5 bg-cream px-5 pb-5 pt-2 dark:border-white/10 dark:bg-[#171513] lg:hidden">{links.map(([key, label]) => <button type="button" key={key} onClick={() => visit(key)} className={`block w-full rounded-xl px-4 py-3 text-left font-semibold ${page === key ? 'bg-[#e8e5d4] text-[#526700] dark:bg-white/10' : ''}`}>{label}</button>)}</div>}
  </header>;
}
