import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Inbox } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import StatusBadge from '@/components/admin/StatusBadge';
import { listBookings } from '@/lib/server/bookings';
import { firstParam, formatRange, rwf } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin bookings',
  robots: { index: false, follow: false },
};

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'open', label: 'Awaiting payment' },
  { key: 'paid', label: 'Paid' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'failed', label: 'Failed' },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const filter = firstParam(params.status) ?? 'all';
  const bookings = listBookings(200);

  const filtered = bookings.filter((booking) => {
    if (filter === 'open') {
      return booking.paymentStatus === 'unpaid' || booking.paymentStatus === 'processing';
    }
    if (filter === 'paid') return booking.paymentStatus === 'paid';
    if (filter === 'cancelled') return booking.status === 'cancelled';
    if (filter === 'failed') return booking.paymentStatus === 'failed';
    return true;
  });

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Reservations"
        title="Bookings"
        description="Every reservation, with payment status. Open a booking to change its status or add an internal note."
      />

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((entry) => {
          const active = filter === entry.key;
          const href = entry.key === 'all' ? '/admin/bookings' : `/admin/bookings?status=${entry.key}`;
          return (
            <Link
              key={entry.key}
              href={href}
              className={
                active
                  ? 'rounded-full bg-forest px-3.5 py-1.5 text-[12px] font-semibold text-white'
                  : 'rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium text-mute transition hover:text-ink'
              }
            >
              {entry.label}
            </Link>
          );
        })}
      </div>

      <section className="overflow-hidden rounded-2xl border border-line bg-white">
        {filtered.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead>
                <tr className="border-b border-line text-[10.5px] uppercase tracking-[0.12em] text-mute">
                  <th className="px-5 py-3 font-semibold">Reference</th>
                  <th className="px-3 py-3 font-semibold">Listing</th>
                  <th className="px-3 py-3 font-semibold">Type</th>
                  <th className="px-3 py-3 font-semibold">Dates</th>
                  <th className="px-3 py-3 font-semibold">Total</th>
                  <th className="px-3 py-3 font-semibold">Payment</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {filtered.map((booking) => (
                  <tr key={booking.reference} className="transition hover:bg-soft/60">
                    <td className="px-5 py-3.5">
                      <Link
                        href={`/admin/bookings/${booking.reference}`}
                        className="text-[12.5px] font-semibold tracking-wide text-forest"
                      >
                        {booking.reference}
                      </Link>
                      <p className="mt-0.5 text-[10.5px] capitalize text-mute">{booking.status}</p>
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] text-ink">{booking.itemName}</td>
                    <td className="px-3 py-3.5 text-[12px] capitalize text-mute">{booking.kind}</td>
                    <td className="px-3 py-3.5 text-[12px] text-mute">
                      {booking.kind === 'stay'
                        ? formatRange(booking.checkIn, booking.checkOut)
                        : booking.checkIn}
                    </td>
                    <td className="px-3 py-3.5 text-[12.5px] font-medium text-ink">
                      {rwf(booking.total)}
                    </td>
                    <td className="px-3 py-3.5">
                      <StatusBadge value={booking.paymentStatus} />
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link
                        href={`/admin/bookings/${booking.reference}`}
                        aria-label={`Open ${booking.reference}`}
                        className="inline-grid h-8 w-8 place-items-center rounded-full text-mute transition hover:bg-soft hover:text-ink"
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="px-5 py-16 text-center">
            <Inbox className="mx-auto h-7 w-7 text-mute/60" strokeWidth={1.5} />
            <p className="mt-3 text-[13.5px] font-medium text-ink">No bookings in this view</p>
            <p className="mt-1 text-[12px] text-mute">
              Try another filter, or wait for the first booking to come in.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
