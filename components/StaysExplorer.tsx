'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Building2,
  ChevronDown,
  Home,
  LayoutGrid,
  SlidersHorizontal,
  Tent,
  TreePine,
  UsersRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import StayCard from './StayCard';
import { STAY_TYPES, type Region, type Stay, type StayType } from '@/lib/data';
import { formatRange, cn } from '@/lib/utils';

type SortKey = 'recommended' | 'price-asc' | 'price-desc' | 'rating';

const SORT_LABELS: Record<SortKey, string> = {
  recommended: 'Recommended',
  'price-asc': 'Price · low to high',
  'price-desc': 'Price · high to low',
  rating: 'Guest rating',
};

const TYPE_ICONS: Record<string, LucideIcon> = {
  All: LayoutGrid,
  Hotels: Building2,
  Lodges: TreePine,
  Camps: Tent,
  Villas: Home,
  Guesthouses: UsersRound,
};

function isStayType(value: string | undefined): value is StayType {
  return !!value && (STAY_TYPES as readonly string[]).includes(value);
}

export default function StaysExplorer({
  stays,
  regions,
  initialType,
  initialRegion,
  initialSort,
  checkIn,
  checkOut,
  guests,
}: {
  stays: Stay[];
  regions: Region[];
  initialType?: string;
  initialRegion?: string;
  initialSort?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
}) {
  const pathname = usePathname();
  const [type, setType] = useState<string>(isStayType(initialType) ? initialType : 'All');
  const [region, setRegion] = useState<string>(
    initialRegion && regions.some((item) => item.slug === initialRegion) ? initialRegion : 'All'
  );
  const [sort, setSort] = useState<SortKey>(
    initialSort && initialSort in SORT_LABELS ? (initialSort as SortKey) : 'recommended'
  );

  const dateRange = formatRange(checkIn, checkOut);
  const guestCount = guests ? Number(guests) : undefined;

  const filtered = useMemo(() => {
    const list = stays.filter((stay) => {
      const typeMatch = type === 'All' || stay.type === type;
      const regionMatch = region === 'All' || stay.region === region;
      return typeMatch && regionMatch;
    });

    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price);
    if (sort === 'rating') return [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [stays, type, region, sort]);

  const stayQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (guests) params.set('guests', guests);
    return params.toString();
  }, [checkIn, checkOut, guests]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (type !== 'All') params.set('type', type);
    if (region !== 'All') params.set('region', region);
    if (sort !== 'recommended') params.set('sort', sort);
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (guests) params.set('guests', guests);
    const next = pathname + (params.toString() ? `?${params.toString()}` : '');
    window.history.replaceState(null, '', next);
  }, [type, region, sort, checkIn, checkOut, guests, pathname]);

  const activeRegion = regions.find((item) => item.slug === region);
  const hasFilters = type !== 'All' || region !== 'All' || sort !== 'recommended';

  const reset = () => {
    setType('All');
    setRegion('All');
    setSort('recommended');
  };

  const removeType = () => setType('All');
  const removeRegion = () => setRegion('All');

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div
            role="group"
            aria-label="Filter by stay type"
            className="no-scrollbar flex items-center gap-0.5 overflow-x-auto"
          >
            {['All', ...STAY_TYPES].map((option) => {
              const active = type === option;
              const Icon = TYPE_ICONS[option] ?? LayoutGrid;
              return (
                <button
                  key={option}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setType(option)}
                  className={cn(
                    'flex shrink-0 flex-col items-center gap-1 rounded-xl px-3 py-2 text-[11.5px] font-medium transition duration-200',
                    active
                      ? 'bg-soft text-ink'
                      : 'text-mute hover:bg-soft/70 hover:text-ink'
                  )}
                >
                  <Icon
                    className={cn('h-[17px] w-[17px]', active ? 'text-forest' : 'text-mute')}
                    strokeWidth={1.7}
                  />
                  {option === 'All' ? 'All stays' : option}
                  <span
                    className={cn(
                      'mt-0.5 h-[2px] w-5 rounded-full transition',
                      active ? 'bg-ink' : 'bg-transparent'
                    )}
                  />
                </button>
              );
            })}
          </div>

          <label className="relative flex shrink-0 items-center gap-2 rounded-full border border-line bg-white px-4 py-2.5 text-[13px] font-medium text-mute">
            <SlidersHorizontal className="h-4 w-4 text-forest" strokeWidth={1.8} />
            <span className="hidden sm:inline">Sort</span>
            <select
              aria-label="Sort stays"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortKey)}
              className="cursor-pointer appearance-none bg-transparent pr-5 font-medium text-ink outline-none"
            >
              {Object.entries(SORT_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-mute" />
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2 border-t border-line pt-4">
          <button
            type="button"
            aria-pressed={region === 'All'}
            onClick={() => setRegion('All')}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition',
              region === 'All'
                ? 'bg-ink text-white'
                : 'border border-line bg-white text-mute hover:border-ink/25 hover:text-ink'
            )}
          >
            All regions
          </button>
          {regions.map((item) => {
            const count = stays.filter((stay) => stay.region === item.slug).length;
            const active = region === item.slug;
            return (
              <button
                key={item.slug}
                type="button"
                aria-pressed={active}
                onClick={() => setRegion(item.slug)}
                className={cn(
                  'rounded-full px-3.5 py-1.5 text-[13px] font-medium transition',
                  active
                    ? 'bg-ink text-white'
                    : 'border border-line bg-white text-mute hover:border-ink/25 hover:text-ink'
                )}
              >
                {item.name}
                <span className={cn('ml-1.5 text-[11px]', active ? 'text-white/60' : 'text-mute/60')}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-mute" aria-live="polite">
          Showing <strong className="font-semibold text-ink">{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'stay' : 'stays'}
          {activeRegion ? (
            <>
              {' '}in <strong className="font-semibold text-ink">{activeRegion.name}</strong>
            </>
          ) : (
            ' across Rwanda'
          )}
          {type !== 'All' ? (
            <>
              {' '}· <strong className="font-semibold text-ink">{type}</strong>
            </>
          ) : null}
          {guestCount ? <> · {guestCount} {guestCount === 1 ? 'guest' : 'guests'}</> : null}
          {dateRange ? <> · {dateRange}</> : null}
        </p>

        {hasFilters ? (
          <div className="flex items-center gap-2">
            {type !== 'All' ? (
              <button type="button" onClick={removeType} className="chip">
                {type}
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            {region !== 'All' ? (
              <button type="button" onClick={removeRegion} className="chip">
                {activeRegion?.name}
                <X className="h-3.5 w-3.5" />
              </button>
            ) : null}
            <button
              type="button"
              onClick={reset}
              className="text-[13px] font-semibold text-ink underline decoration-forest decoration-2 underline-offset-4 transition hover:text-forest"
            >
              Clear all
            </button>
          </div>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <motion.div layout className="mt-7 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((stay, index) => (
              <motion.div
                key={stay.slug}
                layout
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{
                  duration: 0.42,
                  delay: Math.min(index * 0.04, 0.28),
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <StayCard stay={stay} query={stayQuery} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-line bg-soft/70 px-6 py-14 text-center">
          <LayoutGrid className="mx-auto h-10 w-10 text-forest" strokeWidth={1.4} />
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">No stays match those filters yet</h3>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-mute">
            Try another stay type or region. There are {stays.length} handpicked stays waiting
            across Rwanda.
          </p>
          <button type="button" onClick={reset} className="btn-primary mt-6">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
