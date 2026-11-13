'use client';

import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LayoutGrid, X } from 'lucide-react';
import ExperienceCard from './ExperienceCard';
import type { Experience, Region } from '@/lib/data';
import { cn } from '@/lib/utils';

export default function ExperienceExplorer({
  experiences,
  regions,
  initialRegion,
}: {
  experiences: Experience[];
  regions: Region[];
  initialRegion?: string;
}) {
  const [region, setRegion] = useState<string>(
    initialRegion && regions.some((item) => item.slug === initialRegion) ? initialRegion : 'All'
  );

  const filtered = useMemo(
    () =>
      region === 'All'
        ? experiences
        : experiences.filter((experience) => experience.region === region),
    [experiences, region]
  );

  const activeRegion = regions.find((item) => item.slug === region);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-line bg-white p-3">
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
          All experiences
        </button>
        {regions.map((item) => {
          const count = experiences.filter((experience) => experience.region === item.slug).length;
          if (!count) return null;
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-[14px] text-mute" aria-live="polite">
          Showing <strong className="font-semibold text-ink">{filtered.length}</strong>{' '}
          {filtered.length === 1 ? 'experience' : 'experiences'}
          {activeRegion ? (
            <>
              {' '}in <strong className="font-semibold text-ink">{activeRegion.name}</strong>
            </>
          ) : (
            ' across Rwanda'
          )}
        </p>
        {region !== 'All' ? (
          <button
            type="button"
            onClick={() => setRegion('All')}
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-forest underline decoration-gold decoration-2 underline-offset-4"
          >
            Show all
            <X className="h-3.5 w-3.5" />
          </button>
        ) : null}
      </div>

      {filtered.length > 0 ? (
        <motion.div
          layout
          className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((experience, index) => (
              <motion.div
                key={experience.slug}
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
                <ExperienceCard experience={experience} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="mt-7 rounded-2xl border border-dashed border-line bg-soft/70 px-6 py-14 text-center">
          <LayoutGrid className="mx-auto h-10 w-10 text-forest" strokeWidth={1.4} />
          <h3 className="mt-3 font-display text-2xl font-semibold text-ink">Nothing here yet</h3>
          <p className="mx-auto mt-2 max-w-md text-[15px] leading-relaxed text-mute">
            We are adding new guides and experiences in this region. In the meantime, explore all{' '}
            {experiences.length} experiences across Rwanda.
          </p>
          <button type="button" onClick={() => setRegion('All')} className="btn-primary mt-6">
            Show all experiences
          </button>
        </div>
      )}
    </div>
  );
}
