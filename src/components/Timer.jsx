import { useEffect, useMemo, useState } from 'react';
import { FiClock } from 'react-icons/fi';
import toast from 'react-hot-toast';

const secondsFromTime = (value) => {
  const text = String(value || '').toLowerCase();
  const hours = Number(text.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour)/)?.[1] || 0);
  const minutes = Number(text.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/)?.[1] || 0);
  return Math.round(hours * 3600 + minutes * 60);
};

export default function Timer({ time, label }) {
  const duration = useMemo(() => secondsFromTime(time), [time]);
  const [left, setLeft] = useState(0);
  useEffect(() => { setLeft(0); }, [duration]);
  useEffect(() => {
    if (!left) return undefined;
    const interval = window.setInterval(() => setLeft((current) => {
      if (current <= 1) { window.clearInterval(interval); toast.success(`${label || 'Step'} timer completed!`); return 0; }
      return current - 1;
    }), 1000);
    return () => window.clearInterval(interval);
  }, [left, label]);
  if (!duration) return null;
  const display = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  return <button type="button" onClick={() => !left && setLeft(duration)} aria-label={left ? `${label || 'Cooking'} timer: ${display} remaining` : `Start ${time} timer for ${label || 'this step'}`} className="mt-3 inline-flex items-center gap-2 rounded-lg bg-orange/10 px-3 py-2 text-sm font-semibold text-orange"><FiClock />{left ? display : `Start ${time} timer`}</button>;
}
