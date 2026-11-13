import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  CalendarCheck,
  Compass,
  CreditCard,
  MessageSquare,
  Wallet,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import ContentTools from '@/components/admin/ContentTools';
import StatusBadge from '@/components/admin/StatusBadge';
import { getBookingStats } from '@/lib/server/bookings';
import { countContent, getListingRequests } from '@/lib/server/content';
import { paymentMode } from '@/lib/server/payments';
import { formatRange, rwf } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin overview',
  robots: { index: false, follow: false },
};

export default async function AdminOverviewPage() {
  const stats = getBookingStats();
  const content = countContent();
  const requests = getListingRequests();
  const openRequests = requests.filter((request) => request.status === 'new').length;
  const sandbox = paymentMode() === 'sandbox';

  const cards = [
    {
      label: 'Paid revenue',
      value: rwf(Number(stats.revenue) || 0),
      note: `${rwf(Number(stats.revenue30) || 0)} in the last 30 days`,
      icon: Wallet,
    },
    {
      label: 'Bookings',
      value: String(stats.bookings ?? 0),
      note: `${stats.paid ?? 0} paid · ${stats.open ?? 0} awaiting payment`,
      icon: CalendarCheck,
    },
    {
      label: 'Listings',
      value: String(content.stays + content.experiences),
      note: `${content.stays} stays · ${content.experiences} experiences`,
      icon: BedDouble,
    },
    {
      label: 'Host requests',
      value: String(requests.length),
      note: `${openRequests} new to review`,
      icon: MessageSquare,
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        eyebrow="Admin"
        title="Overview"
        description="Bookings, payments and content in one place. Everything here is live on the site as soon as you save it."
        action={
          <span className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[12px] font-semibold text-ink">
            <CreditCard className="h-4 w-4 text-forest" strokeWidth={1.8} />
            Payments: {sandbox ? 'test mode' : 'live'}
          </span>
        }
      />

      {sandbox ? (
        <p className="rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-[12.5px] leading-relaxed text-ink">
          <strong className="font-semibold">Test mode is active.</strong> Bookings can be paid with
          the sandbox confirmation flow, but no real money moves. Add your Flutterwave keys to accept
          live MoMo, Airtel Money and card payments.
        </p>
      ) : null}

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="rounded-2xl border border-line bg-white p-5">
              <div className="flex items-center justify-between">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
                  {card.label}
                </p>
                <Icon className="h-4 w-4 text-forest" strokeWidth={1.8} />
              </div>
              <p className="mt-3 font-display text-[24px] font-semibold leading-none tracking-[-0.03em] text-ink">
                {card.value}
              </p>
              <p className="mt-1.5 text-[11.5px] text-mute">{card.note}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="overflow-hidden rounded-2xl border border-line bg-white">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
              Recent bookings
            </h2>
            <Link
              href="/admin/bookings"
              className="inline-flex items-center gap-1 text-[12px] font-semibold text-forest"
            >
              All bookings
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {stats.recent.length ? (
            <ul className="divide-y divide-line">
              {stats.recent.map((booking) => (
                <li key={booking.reference}>
                  <Link
                    href={`/admin/bookings/${booking.reference}`}
                    className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5 transition hover:bg-soft/60"
                  >
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                        {booking.itemName}
                        <StatusBadge value={booking.paymentStatus} />
                      </p>
                      <p className="mt-0.5 text-[11.5px] text-mute">
                        {booking.reference} · {booking.guests}{' '}
                        {booking.guests === 1 ? 'guest' : 'guests'} ·{' '}
                        {booking.kind === 'stay'
                          ? formatRange(booking.checkIn, booking.checkOut)
                          : booking.checkIn}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[13px] font-semibold text-ink">{rwf(booking.total)}</p>
                      <p className="text-[10.5px] capitalize text-mute">{booking.status}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-12 text-center">
              <BadgeCheck className="mx-auto h-7 w-7 text-mute/60" strokeWidth={1.5} />
              <p className="mt-3 text-[13px] font-medium text-ink">No bookings yet</p>
              <p className="mt-1 text-[12px] text-mute">
                Bookings from the public site will appear here.
              </p>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <ContentTools
            stays={content.stays}
            experiences={content.experiences}
            demoStays={content.demoStays}
            demoExperiences={content.demoExperiences}
          />

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
              Quick actions
            </h2>
            <div className="mt-3 grid gap-2">
              {[
                { href: '/admin/stays/new', label: 'Add a stay', icon: BedDouble },
                { href: '/admin/experiences/new', label: 'Add an experience', icon: Compass },
                { href: '/admin/listing-requests', label: 'Review host requests', icon: MessageSquare },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between rounded-xl border border-line px-3.5 py-2.5 text-[13px] font-medium text-ink transition hover:bg-soft"
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-forest" strokeWidth={1.8} />
                      {action.label}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5 text-mute" />
                  </Link>
                );
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
