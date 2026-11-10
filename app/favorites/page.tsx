import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import FavoritesList from '@/components/FavoritesList';

export const metadata: Metadata = {
  title: 'Saved stays',
  description: 'The stays you have saved for your Rwandan trip.',
};

export default function FavoritesPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="eyebrow">Your list</p>
          <h1 className="mt-3 font-display text-[clamp(32px,4.6vw,48px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
            Saved for <span className="text-forest">later.</span>
          </h1>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-mute">
            A quiet place to keep the stays that caught your eye. Saved on this device — no account
            needed.
          </p>
        </div>
        <Link href="/stays" className="btn-outline">
          Browse all stays
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <FavoritesList />
    </div>
  );
}
