import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  Check,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import BookingPanel from '@/components/BookingPanel';
import FavoriteButton from '@/components/FavoriteButton';
import StayCard from '@/components/StayCard';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';
import { getStay, regionMap, stays, staysInRegion, type Stay } from '@/lib/data';
import { firstParam, rwf } from '@/lib/utils';

const TYPE_LABEL: Record<Stay['type'], string> = {
  Hotels: 'Hotel',
  Lodges: 'Lodge',
  Camps: 'Camp',
  Villas: 'Villa',
  Guesthouses: 'Guesthouse',
};

export function generateStaticParams() {
  return stays.map((stay) => ({ slug: stay.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const stay = getStay(slug);
  if (!stay) return {};
  return {
    title: stay.name,
    description: `${stay.tagline} ${stay.location}, Rwanda. From ${rwf(stay.price)} per night.`,
    openGraph: { images: stay.images },
  };
}

export default async function StayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const stay = getStay(slug);
  if (!stay) notFound();

  const region = regionMap[stay.region];
  const related = staysInRegion(stay.region)
    .filter((item) => item.slug !== stay.slug)
    .slice(0, 4);
  const suggestions = related.length
    ? related
    : stays.filter((item) => item.slug !== stay.slug).slice(0, 4);

  const checkIn = firstParam(query.checkin);
  const checkOut = firstParam(query.checkout);
  const guests = Number(firstParam(query.guests)) || undefined;

  return (
    <div>
      <section className="wrap pt-8">
        <Link
          href="/stays"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          All stays
        </Link>

        <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="eyebrow">
              {TYPE_LABEL[stay.type]} · {region.name}
            </p>
            <h1 className="mt-3 max-w-3xl text-balance font-display text-[clamp(30px,4.4vw,46px)] font-semibold leading-[1.06] tracking-[-0.04em] text-ink">
              {stay.name}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[13px] text-mute">
              <span className="inline-flex items-center gap-1 font-medium text-ink">
                <Star className="h-3.5 w-3.5 fill-ink text-ink" />
                {stay.rating.toFixed(1)}
                <span className="font-normal text-mute">({stay.reviews} reviews)</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {stay.location}
              </span>
              {stay.badge ? (
                <span className="rounded-full border border-line px-2.5 py-1 text-[11px] font-medium text-ink">
                  {stay.badge}
                </span>
              ) : null}
            </div>
          </div>
          <FavoriteButton
            slug={stay.slug}
            name={stay.name}
            className="!h-10 !w-10 border border-line shadow-none"
          />
        </div>

        <div className="mt-6 grid gap-2 overflow-hidden sm:h-[420px] sm:grid-cols-[1.55fr_1fr] sm:grid-rows-2">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-mist sm:row-span-2 sm:aspect-auto">
            <Image
              src={stay.images[0]}
              alt={`${stay.name} — main photo`}
              fill
              priority
              sizes="(max-width: 640px) 100vw, 62vw"
              quality={82}
              className="object-cover"
            />
          </div>
          {stay.images.slice(1, 3).map((image, index) => (
            <div
              key={image}
              className="relative hidden overflow-hidden rounded-2xl bg-mist sm:block"
            >
              <Image
                src={image}
                alt={`${stay.name} — photo ${index + 2}`}
                fill
                sizes="38vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap mt-10">
        <div className="grid gap-10 lg:grid-cols-[1fr_370px] lg:gap-14">
          <div>
            <Reveal>
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 border-b border-line pb-6 text-[14px] text-mute">
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  Sleeps {stay.capacity}
                </span>
                <span className="inline-flex items-center gap-2">
                  <BedDouble className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {stay.beds}
                </span>
                <span className="inline-flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  Vetted by our Kigali team
                </span>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <div className="border-b border-line py-7">
                <h2 className="font-display text-[23px] font-semibold tracking-[-0.025em] text-ink">
                  {stay.tagline}
                </h2>
                <div className="prose-copy mt-4">
                  {stay.description.map((paragraph) => (
                    <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="border-b border-line py-7">
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                  What this place offers
                </h2>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2">
                  {stay.amenities.map((amenity) => (
                    <li key={amenity} className="flex items-start gap-2.5 text-[14px] text-mute">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-soft text-forest">
                        <Check className="h-3 w-3" strokeWidth={2.4} />
                      </span>
                      {amenity}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="border-b border-line py-7">
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                  Where you&apos;ll be
                </h2>
                <p className="mt-2 text-[14px] text-mute">{stay.location}, Rwanda</p>
                <ul className="mt-4 divide-y divide-line rounded-2xl border border-line">
                  {stay.nearby.map((place) => (
                    <li
                      key={place.name}
                      className="flex items-center justify-between gap-4 px-4 py-3 text-[14px]"
                    >
                      <span className="text-ink">{place.name}</span>
                      <span className="shrink-0 text-[12.5px] text-mute">{place.distance}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="py-7">
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                  Meet your host
                </h2>
                <div className="mt-4 flex items-start gap-4">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-forest font-display text-[18px] font-semibold text-white">
                    {stay.host
                      .split(' ')
                      .map((part) => part[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-[15px] font-semibold text-ink">{stay.host}</p>
                    <p className="mt-1 max-w-xl text-[13.5px] leading-relaxed text-mute">
                      {stay.hostNote}
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          <div>
            <div className="lg:sticky lg:top-24">
              <BookingPanel
                kind="stay"
                slug={stay.slug}
                price={stay.price}
                capacity={stay.capacity}
                initialCheckIn={checkIn}
                initialCheckOut={checkOut}
                initialGuests={guests}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="More in the area"
            title={
              <>
                Other stays in <span className="text-forest">{region.name}.</span>
              </>
            }
            action={
              <Link href={`/stays?region=${region.slug}`} className="btn-outline">
                See all
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </Reveal>
        <div className="mt-9 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
          {suggestions.map((item, index) => (
            <Reveal key={item.slug} delay={Math.min(index * 0.06, 0.2)}>
              <StayCard stay={item} />
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
