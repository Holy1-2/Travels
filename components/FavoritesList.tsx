'use client';

import Link from 'next/link';
import { Heart, Search } from 'lucide-react';
import StayCard from './StayCard';
import { useFavorites } from './FavoritesProvider';
import type { Stay } from '@/lib/data';

export default function FavoritesList({ stays }: { stays: Stay[] }) {
  const { favorites, ready } = useFavorites();

  if (!ready) {
    return (
      <div className="mt-8 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[4/5] rounded-2xl bg-mist" />
            <div className="mt-3 h-4 w-3/4 rounded bg-mist" />
            <div className="mt-2 h-3 w-1/2 rounded bg-mist" />
          </div>
        ))}
      </div>
    );
  }

  const saved = stays.filter((stay) => favorites.includes(stay.slug));

  if (!saved.length) {
    return (
      <div className="mt-8 rounded-2xl border border-dashed border-line bg-soft/70 px-6 py-16 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-white text-forest">
          <Heart className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <h2 className="mt-4 font-display text-[24px] font-semibold tracking-[-0.02em] text-ink">
          Nothing saved yet
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">
          Tap the heart on any stay and it will appear here, ready for when you are.
        </p>
        <Link href="/stays" className="btn-primary mt-6">
          <Search className="h-4 w-4" />
          Browse stays
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="mt-2 text-[13.5px] text-mute" aria-live="polite">
        {saved.length} saved {saved.length === 1 ? 'stay' : 'stays'}
      </p>
      <div className="mt-6 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
        {saved.map((stay) => (
          <StayCard key={stay.slug} stay={stay} />
        ))}
      </div>
    </div>
  );
}
