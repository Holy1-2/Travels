import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, CalendarDays, CreditCard, MapPin } from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import StaysExplorer from '@/components/StaysExplorer';
import Reveal from '@/components/Reveal';
import { regions } from '@/lib/data';
import { getStays } from '@/lib/server/content';
import { firstParam } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Stays',
  description:
    'Browse handpicked hotels, lodges, camps, villas and guesthouses across Rwanda. Filter by region and stay type, with prices in RWF.',
};

export default async function StaysPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const initialType = firstParam(params.type);
  const initialRegion = firstParam(params.region);
  const initialSort = firstParam(params.sort);
  const checkIn = firstParam(params.checkin);
  const checkOut = firstParam(params.checkout);
  const guests = firstParam(params.guests);
  const stays = getStays();
  const regionCount = new Set(stays.map((stay) => stay.region)).size;

  return (
    <div>
      <section className="border-b border-line bg-hero-wash">
        <div className="wrap pb-9 pt-10 lg:pb-12 lg:pt-14">
          <p className="eyebrow">Stays across Rwanda</p>
          <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <h1 className="max-w-[18ch] text-balance font-display text-[clamp(34px,4.8vw,52px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
                {stays.length} ways to <span className="text-forest">wake up here.</span>
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-mute">
                Hotels, lodges, forest camps, private villas and garden guesthouses — each one
                visited by our team. Filter by type, region or price and watch the list update.
              </p>
            </div>
            <div className="flex items-center gap-2.5 rounded-full border border-line bg-white px-4 py-2.5 text-[12px] text-mute">
              <MapPin className="h-4 w-4 text-forest" strokeWidth={1.8} />
              {regionCount} {regionCount === 1 ? 'region' : 'regions'} · {stays.length}{' '}
              {stays.length === 1 ? 'stay' : 'stays'} · prices in RWF
            </div>
          </div>

          <div className="mt-7">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="wrap mt-8 pb-2">
        <StaysExplorer
          stays={stays}
          regions={regions}
          initialType={initialType}
          initialRegion={initialRegion}
          initialSort={initialSort}
          checkIn={checkIn}
          checkOut={checkOut}
          guests={guests}
        />
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <div className="grid gap-6 rounded-2xl border border-line bg-soft/70 p-6 sm:grid-cols-3 sm:p-8">
            {[
              {
                icon: CalendarDays,
                title: 'Flexible plans',
                copy: 'Free cancellation up to 72 hours before check-in on every listed stay.',
              },
              {
                icon: CreditCard,
                title: 'Pay in the app',
                copy: 'Reserve online, then pay securely with MoMo, Airtel Money, Visa or Mastercard.',
              },
              {
                icon: MapPin,
                title: 'Locally vetted',
                copy: 'We visit every property and re-check details twice a year. No stock listings.',
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex gap-3.5">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-forest">
                    <Icon className="h-4 w-4" strokeWidth={1.8} />
                  </span>
                  <div>
                    <h3 className="text-[14px] font-semibold text-ink">{item.title}</h3>
                    <p className="mt-1 text-[13px] leading-relaxed text-mute">{item.copy}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl bg-forest px-7 py-8 text-white sm:flex-row sm:items-center sm:px-10">
            <div>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Traveling with a group?
              </p>
              <h2 className="mt-2 font-display text-[24px] font-semibold leading-tight tracking-[-0.02em] text-white sm:text-[28px]">
                Tell us the shape of your trip — we will do the matching.
              </h2>
              <p className="mt-1.5 flex flex-wrap items-center gap-x-5 gap-y-1 text-[12.5px] text-white/55">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" /> 1–14 nights
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" /> Pay in RWF
                </span>
                <span>Reply within 24 hours</span>
              </p>
            </div>
            <Link href="/about" className="btn-gold shrink-0">
              How it works
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
