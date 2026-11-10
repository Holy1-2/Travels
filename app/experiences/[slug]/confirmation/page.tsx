import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Users,
} from 'lucide-react';
import { getExperience, regionMap } from '@/lib/data';
import {
  addDays,
  bookingRef,
  firstParam,
  formatLongDay,
  rwf,
  todayISO,
} from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Request sent',
  description: 'Your experience request has been sent to the guide.',
};

export default async function ExperienceConfirmationPage({
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

  const date = firstParam(query.date) || addDays(todayISO(), 7);
  const guests = Math.max(1, Math.min(Number(firstParam(query.guests)) || 2, 10));
  const subtotal = experience.price * guests;
  const service = Math.round(subtotal * 0.03);
  const total = subtotal + service;
  const reference = bookingRef(slug + date + guests);
  const region = regionMap[experience.region];

  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest text-white">
            <Check className="h-6 w-6" strokeWidth={2.2} />
          </span>
          <p className="eyebrow mt-5 justify-center">Request sent</p>
          <h1 className="mt-3 text-balance font-display text-[clamp(30px,4.4vw,44px)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink">
            Your guide will confirm shortly.
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-mute">
            No payment has been taken. We will confirm your date with the guide and send meeting
            details the day before.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-soft px-4 py-2 text-[13px]">
            <span className="text-mute">Booking reference</span>
            <strong className="font-semibold tracking-wide text-ink">{reference}</strong>
          </p>
        </div>

        <div className="mt-10 overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex flex-col sm:flex-row">
            <div className="relative aspect-[16/10] w-full bg-mist sm:aspect-auto sm:w-56 sm:shrink-0">
              <Image
                src={experience.image}
                alt={experience.name}
                fill
                sizes="(max-width: 640px) 100vw, 220px"
                className="object-cover"
              />
            </div>
            <div className="flex-1 p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                {region.name}
              </p>
              <h2 className="mt-1 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
                {experience.name}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-[13px] text-mute">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {experience.meetingPoint}
              </p>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-mute">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {formatLongDay(date)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {experience.duration}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {guests} {guests === 1 ? 'guest' : 'guests'}
                </span>
              </div>
            </div>
          </div>

          <dl className="space-y-2.5 border-t border-line px-5 py-5 text-[14px] sm:px-6">
            <div className="flex items-center justify-between text-mute">
              <dt>
                {rwf(experience.price)} × {guests} {guests === 1 ? 'guest' : 'guests'}
              </dt>
              <dd className="font-medium text-ink">{rwf(subtotal)}</dd>
            </div>
            <div className="flex items-center justify-between text-mute">
              <dt>Booking fee</dt>
              <dd className="font-medium text-ink">{rwf(service)}</dd>
            </div>
            <div className="flex items-center justify-between border-t border-line pt-3 text-[15px] font-semibold text-ink">
              <dt>Estimated total</dt>
              <dd>{rwf(total)}</dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: Mail,
              title: 'Guide confirms',
              copy: 'We check availability and reply within 24 hours.',
            },
            {
              icon: MessageCircle,
              title: 'Meet the guide',
              copy: 'Meeting point and timing are sent the day before.',
            },
            {
              icon: CalendarDays,
              title: 'Free changes',
              copy: 'Reschedule up to 72 hours before your experience.',
            },
          ].map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.title} className="rounded-2xl border border-line p-4">
                <Icon className="h-4 w-4 text-forest" strokeWidth={1.8} />
                <p className="mt-3 text-[13.5px] font-semibold text-ink">{step.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{step.copy}</p>
              </div>
            );
          })}
        </div>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link href="/experiences" className="btn-primary">
            More experiences
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href={`/experiences/${experience.slug}`} className="btn-outline">
            Back to experience
          </Link>
        </div>
      </div>
    </div>
  );
}
