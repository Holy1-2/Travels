import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowRight, CalendarDays, Mountain, MapPin, Sparkles } from 'lucide-react';
import StayCard from '@/components/StayCard';
import ExperienceCard from '@/components/ExperienceCard';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import {
  experiencesInRegion,
  regionMap,
  regions,
  staysInRegion,
  type RegionSlug,
} from '@/lib/data';

export function generateStaticParams() {
  return regions.map((region) => ({ slug: region.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const region = regionMap[slug as RegionSlug];
  if (!region) return {};
  return {
    title: region.name,
    description: `${region.tagline}. ${region.intro} Handpicked stays and experiences in ${region.name}, Rwanda.`,
    openGraph: { images: [region.image] },
  };
}

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const region = regionMap[slug as RegionSlug];
  if (!region) notFound();

  const regionStays = staysInRegion(region.slug);
  const regionExperiences = experiencesInRegion(region.slug);
  const otherRegions = regions.filter((item) => item.slug !== region.slug);

  return (
    <div>
      <section className="wrap pt-8">
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All destinations
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="eyebrow">{region.place}</p>
            <h1 className="mt-3 font-display text-[clamp(36px,5.2vw,56px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
              {region.name}
            </h1>
            <p className="mt-2 max-w-xl text-[16px] leading-relaxed text-mute">{region.tagline}</p>
          </div>
          <div className="flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-[12.5px] text-mute">
            <MapPin className="h-4 w-4 text-forest" strokeWidth={1.8} />
            {regionStays.length} stays · {regionExperiences.length} experiences
          </div>
        </div>

        <div className="relative mt-7 aspect-[16/9] overflow-hidden rounded-2xl bg-mist sm:aspect-[21/9]">
          <Image
            src={region.image}
            alt={`${region.name}, Rwanda`}
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <p className="absolute bottom-4 left-4 max-w-md text-[13.5px] font-medium text-white/90">
            {region.intro}
          </p>
        </div>
      </section>

      <section className="wrap mt-12">
        <div className="grid gap-10 lg:grid-cols-[1.35fr_0.65fr] lg:gap-16">
          <Reveal>
            <div>
              <h2 className="font-display text-[24px] font-semibold tracking-[-0.025em] text-ink">
                About {region.name}
              </h2>
              <div className="prose-copy mt-4">
                {region.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <aside className="rounded-2xl border border-line bg-soft/70 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Plan your visit
              </p>
              <dl className="mt-4 space-y-4">
                <div className="flex items-start gap-3">
                  <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
                  <div>
                    <dt className="text-[12px] font-medium text-mute">Best time</dt>
                    <dd className="text-[14px] font-semibold text-ink">{region.bestTime}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mountain className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
                  <div>
                    <dt className="text-[12px] font-medium text-mute">Typical altitude</dt>
                    <dd className="text-[14px] font-semibold text-ink">{region.altitude}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
                  <div>
                    <dt className="text-[12px] font-medium text-mute">Don&apos;t miss</dt>
                    <dd className="mt-1 flex flex-wrap gap-1.5">
                      {region.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full border border-line bg-white px-2.5 py-1 text-[11.5px] font-medium text-ink"
                        >
                          {highlight}
                        </span>
                      ))}
                    </dd>
                  </div>
                </div>
              </dl>
              <Link href="/stays" className="btn-primary mt-6 w-full">
                Find a stay here
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </Reveal>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="Places to wake up"
            title={
              <>
                Stays in <span className="text-forest">{region.name}.</span>
              </>
            }
            subtitle={`${regionStays.length} handpicked ${regionStays.length === 1 ? 'property' : 'properties'} in this region.`}
            action={
              <Link href={`/stays?region=${region.slug}`} className="btn-outline">
                Filter all stays
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-9 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {regionStays.map((stay, index) => (
            <Reveal key={stay.slug} delay={Math.min(index * 0.06, 0.2)}>
              <StayCard stay={stay} eager={index < 4} />
            </Reveal>
          ))}
        </div>
      </section>

      {regionExperiences.length ? (
        <section className="wrap mt-20 lg:mt-24">
          <Reveal>
            <SectionHeader
              eyebrow="Things to do"
              title={
                <>
                  A day in <span className="text-forest">{region.name}.</span>
                </>
              }
              subtitle="Local guides, small groups and the details already handled."
            />
          </Reveal>
          <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regionExperiences.map((experience, index) => (
              <Reveal key={experience.slug} delay={Math.min(index * 0.07, 0.2)}>
                <ExperienceCard experience={experience} />
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <div className="rounded-2xl border border-line bg-white p-6 sm:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-[22px] font-semibold tracking-[-0.02em] text-ink">
                Keep exploring
              </h2>
              <Link
                href="/destinations"
                className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-ink underline decoration-forest decoration-2 underline-offset-4 hover:text-forest"
              >
                All destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
              {otherRegions.map((item) => (
                <Link
                  key={item.slug}
                  href={`/destinations/${item.slug}`}
                  className="group rounded-xl border border-line px-4 py-3 transition hover:border-ink/20 hover:bg-soft"
                >
                  <p className="text-[14px] font-semibold text-ink">{item.name}</p>
                  <p className="mt-0.5 text-[11.5px] text-mute">{item.place}</p>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
