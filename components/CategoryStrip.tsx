'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import IsoIcon, { type IsoCategoryName } from './IsoIcon';
import { cn } from '@/lib/utils';

const CATEGORIES: { label: string; type: string; icon: IsoCategoryName }[] = [
  { label: 'All stays', type: 'All', icon: 'all' },
  { label: 'Hotels', type: 'Hotels', icon: 'hotels' },
  { label: 'Lodges', type: 'Lodges', icon: 'lodges' },
  { label: 'Camps', type: 'Camps', icon: 'camps' },
  { label: 'Villas', type: 'Villas', icon: 'villas' },
  { label: 'Guesthouses', type: 'Guesthouses', icon: 'guesthouses' },
];

export default function CategoryStrip() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeType = pathname === '/stays' ? searchParams.get('type') || 'All' : null;

  return (
    <nav
      aria-label="Browse stays by type"
      className="no-scrollbar flex items-center gap-1 overflow-x-auto border-t border-line/70 py-1.5"
    >
      {CATEGORIES.map((category) => {
        const active = activeType === category.type;
        const href =
          category.type === 'All'
            ? '/stays'
            : `/stays?type=${encodeURIComponent(category.type)}`;

        return (
          <Link
            key={category.type}
            href={href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'group flex shrink-0 flex-col items-center gap-0.5 rounded-2xl px-4 pb-1.5 pt-1.5 text-[12px] font-medium transition duration-300 ease-smooth',
              active
                ? 'bg-soft text-forest'
                : 'text-mute hover:bg-soft/70 hover:text-forest'
            )}
          >
            <IsoIcon
              name={category.icon}
              className={cn(
                'h-[42px] w-[42px] drop-shadow-[0_6px_4px_rgba(15,61,46,0.22)] transition duration-300 ease-smooth group-hover:-translate-y-1 group-hover:scale-105 sm:h-[46px] sm:w-[46px]',
                active && 'scale-105'
              )}
            />
            {category.label}
            <span
              className={cn(
                'mt-0.5 h-[3px] w-6 rounded-full transition',
                active ? 'bg-gold' : 'bg-transparent'
              )}
            />
          </Link>
        );
      })}
    </nav>
  );
}
