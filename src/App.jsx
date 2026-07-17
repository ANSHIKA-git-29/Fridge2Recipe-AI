import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SavedRecipes from './components/SavedRecipes';
import Home from './pages/Home';
import Community from './pages/Community';
import Blog from './pages/Blog';
import SubmitRecipe from './pages/SubmitRecipe';
import { useTheme } from './hooks/useTheme';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateRecipe } from './services/ai';

const id = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;

export default function App() {
  const [dark, setDark] = useTheme();
  const [page, setPage] = useState('home');
  const [recipe, setRecipe] = useState(null);
  const [status, setStatus] = useState('idle');
  const [insufficient, setInsufficient] = useState(null);
  const [saved, setSaved] = useLocalStorage('f2r-recipes', []);
  const [, setHistory] = useLocalStorage('f2r-history', []);
  const activeRequest = useRef(null);

  const generate = async (ingredients) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    setInsufficient(null);
    setStatus('loading');
    try {
      const result = await generateRecipe(ingredients, { signal: controller.signal });
      if (activeRequest.current !== controller) return;
      if (result.status === 'insufficient_ingredients') { setInsufficient(result); setStatus('insufficient'); return; }
      const next = { ...result, id: id(), generatedAt: Date.now(), sourceIngredients: ingredients };
      setRecipe(next);
      setHistory((items) => [next, ...items.filter((item) => item.recipeName !== next.recipeName)].slice(0, 15));
      setStatus('idle');
    } catch (error) {
      if (error.name !== 'AbortError' && activeRequest.current === controller) setStatus('error');
    } finally {
      if (activeRequest.current === controller) activeRequest.current = null;
    }
  };
  const upsertSaved = (next) => setSaved((items) => [next, ...items.filter((item) => item.id !== next.id)]);
  const save = () => { if (!recipe) return; upsertSaved({ ...recipe, favorite: recipe.favorite || false, savedAt: Date.now() }); toast.success('Recipe saved.'); };
  const favorite = () => { if (!recipe) return; const next = { ...recipe, favorite: !recipe.favorite, savedAt: Date.now() }; setRecipe(next); upsertSaved(next); toast.success(next.favorite ? 'Favorite updated.' : 'Removed from favorites.'); };

  const home = <Home recipe={recipe} generate={generate} status={status} insufficient={insufficient} onClearInsufficient={() => { setInsufficient(null); setStatus('idle'); }} onSave={save} favorite={Boolean(recipe?.favorite)} onFavorite={favorite} onResetRecipe={() => { activeRequest.current?.abort(); setStatus('idle'); setInsufficient(null); setRecipe(null); }} />;
  const content = page === 'saved' ? <SavedRecipes recipes={saved} onOpen={(item) => { setRecipe(item); setPage('home'); }} onDelete={(recipeId) => { setSaved((items) => items.filter((item) => item.id !== recipeId)); toast.success('Recipe deleted.'); }} /> : page === 'community' ? <Community /> : page === 'blog' ? <Blog /> : page === 'submit' ? <SubmitRecipe /> : home;
  return <div className="min-h-screen"><Navbar page={page} setPage={setPage} dark={dark} setDark={setDark} /><AnimatePresence mode="wait"><motion.div key={page} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>{content}</motion.div></AnimatePresence><Footer /></div>;
}
