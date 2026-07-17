import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiCoffee } from 'react-icons/fi';

const stages = [
  '🥕 Understanding ingredients...',
  '🍳 Designing recipe...',
  '🧂 Choosing seasonings...',
  '📋 Building cooking guide...',
];

export default function Loader() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setStage((current) => Math.min(current + 1, stages.length - 1)), 620);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="glass mx-auto max-w-3xl rounded-[2rem] p-7 text-center sm:p-10" role="status" aria-live="polite">
      <motion.div
        animate={{ rotate: [-10, 10, -10], y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 1.2 }}
        className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-orange to-sun text-3xl text-white"
      >
        <FiCoffee />
      </motion.div>

      <h2 className="font-serif text-3xl">Cooking up an idea…</h2>
      <motion.p key={stage} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="mt-2 font-medium text-orange">
        {stages[stage]}
      </motion.p>

      <div className="mx-auto mt-6 flex max-w-md items-center justify-between gap-2" aria-label={`Generation progress: step ${stage + 1} of ${stages.length}`}>
        {stages.map((label, index) => (
          <div key={label} className="flex flex-1 items-center gap-2">
            <motion.span
              animate={{ scale: index === stage ? [1, 1.15, 1] : 1 }}
              transition={{ duration: 0.45 }}
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs ${index < stage ? 'bg-emerald-500 text-white' : index === stage ? 'bg-orange text-white' : 'bg-black/5 text-black/35 dark:bg-white/10 dark:text-white/40'}`}
            >
              {index < stage ? <FiCheck /> : index + 1}
            </motion.span>
            {index < stages.length - 1 && <span className={`h-0.5 flex-1 rounded-full ${index < stage ? 'bg-emerald-500' : 'bg-black/10 dark:bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3" aria-hidden="true">
        {[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-2xl bg-black/5 dark:bg-white/10" />)}
      </div>
    </div>
  );
}
