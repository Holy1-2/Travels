import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, MapPin, Mountain, Waves } from 'lucide-react';
import DestinationCard from '@/components/DestinationCard';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { experiences, regions, stays, staysInRegion } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Destinations',
  description:
    'Explore Rwanda by region — Volcanoes, Lake Kivu, Nyungwe, Akagera, Kigali and the Twin Lakes. Find handpicked stays and local experiences in each.',
};

const tips = [
  {
    icon: Mountain,
    title: 'North for gorillas',
    copy: 'Musanze and the Virunga foothills put you closest to the park briefing point and the best volcano views.',
  },
  {
    icon: Waves,
    title: 'West for water',
    copy: 'Lake Kivu rewards slow travel: sandy bays, boat mornings and long sunsets over the islands.',
  },
  {
    icon: Compass,
    title: 'East for safari',
    copy: 'Akagera is a full day of savannah and lakes. Stay inside the park to catch the first light.',
  },
];

export default function DestinationsPage() {
  return (
    <div>
      <section className="border-b border-line bg-hero-wash">
        <div className="wrap pb-12 pt-12 lg:pb-16 lg:pt-16">
          <p className="eyebrow">Where to go</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h1 className="max-w-[16ch] text-balance font-display text-[clamp(36px,5.4vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
              Six regions, <span className="text-forest">one small country.</span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-mute">
              Rwanda fits into a week, but each corner asks for a different kind of stay. Choose a
              region, then let the landscape decide the rest.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-6 text-[12.5px] text-mute">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-forest" strokeWidth={1.8} />
              {regions.length} regions
            </span>
            <span>{stays.length} handpicked stays</span>
            <span>{experiences.length} local experiences</span>
            <span>Prices in RWF</span>
          </div>
        </div>
      </section>

      <section className="wrap mt-12">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, index) => (
            <Reveal key={region.slug} delay={Math.min(index * 0.05, 0.25)}>
              <DestinationCard
                region={region}
                stayCount={staysInRegion(region.slug).length}
                eager={index < 3}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <SectionHeader
            eyebrow="A simple way in"
            title={
              <>
                Pick your first <span className="text-forest">three nights.</span>
              </>
            }
            subtitle="Most travellers land in Kigali, then move once or twice. These are the routes we suggest most often."
          />
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {tips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Reveal key={tip.title} delay={Math.min(index * 0.07, 0.2)}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-soft text-forest">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{tip.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{tip.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line bg-soft px-7 py-8 sm:flex-row sm:items-center sm:px-10">
            <div>
              <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink sm:text-[26px]">
                Not sure which region fits your trip?
              </h2>
              <p className="mt-1 text-[14px] text-mute">
                Send us your dates and we will sketch a short route around them.
              </p>
            </div>
            <Link href="/stays" className="btn-primary shrink-0">
              Browse stays
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
