import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Compass, HeartHandshake, ShieldCheck, Users } from 'lucide-react';
import ExperienceExplorer from '@/components/ExperienceExplorer';
import Reveal from '@/components/Reveal';
import { experiences } from '@/lib/data';
import { firstParam } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Experiences',
  description:
    'Gorilla trekking, Lake Kivu sunsets, Nyungwe canopy walks, Akagera safaris and Kigali coffee tours — all led by licensed local guides.',
};

const promises = [
  {
    icon: Users,
    title: 'Small groups',
    copy: 'Capped group sizes so the guide has time for every question and every photograph.',
  },
  {
    icon: ShieldCheck,
    title: 'Licensed guides',
    copy: 'Every experience is run by a Rwandan guide or cooperative, paid at a fair local rate.',
  },
  {
    icon: HeartHandshake,
    title: 'Community first',
    copy: 'A share of each booking goes to conservation and park-edge community projects.',
  },
];

export default async function ExperiencesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialRegion = firstParam(params.region);

  return (
    <div>
      <section className="border-b border-line bg-hero-wash">
        <div className="wrap pb-10 pt-12 lg:pb-12 lg:pt-16">
          <p className="eyebrow">Things to do</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <h1 className="max-w-[17ch] text-balance font-display text-[clamp(36px,5.4vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
              Mornings you will <span className="text-forest">talk about.</span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-mute">
              Ten experiences, from a quiet hour with mountain gorillas to a sunset boat on Lake
              Kivu. Led by people who live here.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-2 border-t border-line pt-6 text-[12.5px] text-mute">
            <span className="inline-flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-forest" strokeWidth={1.8} />
              {experiences.length} experiences
            </span>
            <span>6 regions</span>
            <span>Local guides</span>
            <span>Prices in RWF</span>
          </div>
        </div>
      </section>

      <section className="wrap mt-8">
        <ExperienceExplorer initialRegion={initialRegion} />
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <div className="grid gap-6 rounded-2xl border border-line bg-soft/70 p-6 sm:grid-cols-3 sm:p-8">
            {promises.map((promise) => {
              const Icon = promise.icon;
              return (
                <div key={promise.title} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-forest">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-ink">{promise.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-mute">{promise.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-forest px-7 py-8 text-white sm:flex-row sm:items-center sm:px-10">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Build a trip
              </p>
              <h2 className="mt-2 font-display text-[24px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
                Pair a stay with the right morning out.
              </h2>
              <p className="mt-1.5 text-[13px] text-white/55">
                We can hold dates while your group decides.
              </p>
            </div>
            <Link href="/stays" className="btn-gold shrink-0">
              Find a stay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
