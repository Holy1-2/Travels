'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Heart } from 'lucide-react';

type FavoritesContextValue = {
  favorites: string[];
  ready: boolean;
  count: number;
  isFavorite: (slug: string) => boolean;
  toggle: (slug: string, name?: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);
const STORAGE_KEY = 'hamubere:favorites';

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavorites(parsed.filter((item) => typeof item === 'string'));
      }
    } catch {
      // ignore unreadable storage
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // storage might be unavailable in private mode
    }
  }, [favorites, ready]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const toggle = useCallback((slug: string, name?: string) => {
    setFavorites((current) => {
      const exists = current.includes(slug);
      const next = exists ? current.filter((item) => item !== slug) : [...current, slug];
      setToast(
        exists ? 'Removed from your saved stays' : `${name ? name + ' saved' : 'Saved'} to your list`
      );
      return next;
    });
  }, []);

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      ready,
      count: favorites.length,
      isFavorite: (slug: string) => favorites.includes(slug),
      toggle,
    }),
    [favorites, ready, toggle]
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
      <AnimatePresence>
        {toast && (
          <motion.div
            role="status"
            aria-live="polite"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-6 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-gold/40 bg-forest px-5 py-3 text-[14px] font-medium text-white shadow-lift"
          >
            <Heart className="h-4 w-4 fill-gold text-gold" />
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used inside FavoritesProvider');
  }
  return context;
}
