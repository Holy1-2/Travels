import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  Info,
  MapPin,
  ShieldCheck,
  Users,
} from 'lucide-react';
import BookingPanel from '@/components/BookingPanel';
import ExperienceCard from '@/components/ExperienceCard';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { experiences, getExperience, regionMap } from '@/lib/data';
import { firstParam } from '@/lib/utils';

export function generateStaticParams() {
  return experiences.map((experience) => ({ slug: experience.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const experience = getExperience(slug);
  if (!experience) return {};
  return {
    title: experience.name,
    description: experience.summary,
    openGraph: { images: [experience.image] },
  };
}

export default async function ExperiencePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const experience = getExperience(slug);
  if (!experience) notFound();

  const region = regionMap[experience.region];
  const related = experiences
    .filter((item) => item.slug !== experience.slug && item.region === experience.region)
    .slice(0, 3);
  const fallback = experiences.filter((item) => item.slug !== experience.slug).slice(0, 3);
  const suggestions = related.length ? related : fallback;

  const initialDate = firstParam(query.date);
  const initialGuests = Number(firstParam(query.guests)) || undefined;

  return (
    <div>
      <section className="wrap pt-8">
        <Link
          href="/experiences"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All experiences
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-5">
          <div className="max-w-3xl">
            <p className="eyebrow">{region.name}</p>
            <h1 className="mt-3 text-balance font-display text-[clamp(32px,4.6vw,50px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
              {experience.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-[13px] text-mute">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-4 w-4 text-forest" strokeWidth={1.8} />
                {experience.duration}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-forest" strokeWidth={1.8} />
                {experience.groupSize}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-forest" strokeWidth={1.8} />
                {experience.meetingPoint}
              </span>
            </div>
          </div>
          <Link
            href={`/destinations/${region.slug}`}
            className="rounded-full border border-line bg-white px-4 py-2.5 text-[12.5px] font-medium text-ink transition hover:border-ink/25 hover:bg-soft"
          >
            About {region.name}
          </Link>
        </div>

        <div className="relative mt-7 aspect-[16/10] overflow-hidden rounded-2xl bg-mist sm:aspect-[21/9]">
          <Image
            src={experience.image}
            alt={experience.name}
            fill
            priority
            sizes="100vw"
            quality={82}
            className="object-cover"
          />
        </div>
      </section>

      <section className="wrap mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_370px] lg:gap-14">
          <div>
            <Reveal>
              <p className="text-[17px] font-medium leading-relaxed text-ink">
                {experience.summary}
              </p>
              <div className="prose-copy mt-4">
                {experience.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.05}>
              <div className="mt-9 border-t border-line pt-7">
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                  What&apos;s included
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {experience.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-mute">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-soft text-forest">
                        <Check className="h-3 w-3" strokeWidth={2.4} />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="mt-9 grid gap-4 border-t border-line pt-7 sm:grid-cols-2">
                <div className="rounded-2xl border border-line p-5">
                  <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">
                    <MapPin className="h-4 w-4 text-forest" strokeWidth={1.8} />
                    Meeting point
                  </p>
                  <p className="mt-2 text-[14.5px] font-medium text-ink">
                    {experience.meetingPoint}
                  </p>
                  <p className="mt-1 text-[13px] leading-relaxed text-mute">
                    Arrive 15 minutes early. Your guide will confirm the exact spot the day before.
                  </p>
                </div>
                <div className="rounded-2xl border border-line p-5">
                  <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.14em] text-mute">
                    <Info className="h-4 w-4 text-forest" strokeWidth={1.8} />
                    Good to know
                  </p>
                  <ul className="mt-2 space-y-1.5 text-[13px] leading-relaxed text-mute">
                    <li>Wear comfortable shoes and a light rain layer.</li>
                    <li>Bring a copy of your passport for park permits.</li>
                    <li>Free rescheduling up to 72 hours before the start.</li>
                  </ul>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="mt-9 flex items-start gap-3 rounded-2xl bg-soft p-5">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.7} />
                <p className="text-[13.5px] leading-relaxed text-mute">
                  This experience is operated by a licensed Rwandan guide or cooperative. Hamubere
                  handles the request, the details and the follow-up — you pay the guide directly
                  once your date is confirmed.
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <BookingPanel
                kind="experience"
                slug={experience.slug}
                price={experience.price}
                name={experience.name}
                groupSize={experience.groupSize}
                initialDate={initialDate}
                initialGuests={initialGuests}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="More to do"
            title={
              <>
                Pair it with <span className="text-forest">another morning.</span>
              </>
            }
            action={
              <Link href="/experiences" className="btn-outline">
                All experiences
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-9 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((item, index) => (
            <Reveal key={item.slug} delay={Math.min(index * 0.07, 0.2)}>
              <ExperienceCard experience={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
