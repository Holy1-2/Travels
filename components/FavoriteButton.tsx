'use client';

import { Heart } from 'lucide-react';
import { useFavorites } from './FavoritesProvider';
import { cn } from '@/lib/utils';

export default function FavoriteButton({
  slug,
  name,
  className,
}: {
  slug: string;
  name: string;
  className?: string;
}) {
  const { isFavorite, toggle, ready } = useFavorites();
  const active = ready && isFavorite(slug);

  return (
    <button
      type="button"
      aria-label={active ? `Remove ${name} from your list` : `Save ${name} to your list`}
      aria-pressed={active}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        toggle(slug, name);
      }}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-full bg-white/95 text-ink transition duration-300 hover:scale-105 hover:bg-white',
        className
      )}
    >
      <span key={active ? 'saved' : 'empty'} className={active ? 'animate-pop' : undefined}>
        <Heart
          className={cn('h-[17px] w-[17px] transition', active && 'fill-gold text-gold')}
          strokeWidth={1.8}
        />
      </span>
    </button>
  );
}
