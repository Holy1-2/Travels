import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  CreditCard,
  Mail,
  MapPin,
  MessageCircle,
  ReceiptText,
  Users,
} from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import BookingAdminForm from '@/components/admin/BookingAdminForm';
import StatusBadge from '@/components/admin/StatusBadge';
import { getBooking, getBookingEvents } from '@/lib/server/bookings';
import { getExperienceBySlug, getStayBySlug } from '@/lib/server/content';
import { formatLongDay, formatRange, rwf } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin booking detail',
  robots: { index: false, follow: false },
};

const METHOD_LABEL: Record<string, string> = {
  card: 'Visa / Mastercard',
  mtn: 'MTN MoMo',
  airtel: 'Airtel Money',
};

function formatTimestamp(value: string) {
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function AdminBookingDetailPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;
  const booking = getBooking(reference);
  if (!booking) notFound();

  const events = getBookingEvents(booking.reference);
  const stay = booking.kind === 'stay' ? getStayBySlug(booking.itemSlug) : undefined;
  const experience =
    booking.kind === 'experience' ? getExperienceBySlug(booking.itemSlug) : undefined;
  const location = stay?.location ?? experience?.meetingPoint ?? 'Rwanda';

  return (
    <div className="space-y-5">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-mute transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to bookings
      </Link>

      <AdminPageHeader
        eyebrow={booking.kind === 'stay' ? 'Stay booking' : 'Experience booking'}
        title={booking.reference}
        description={`Created ${formatTimestamp(booking.createdAt)} · last updated ${formatTimestamp(
          booking.updatedAt
        )}`}
        action={
          <div className="flex flex-wrap gap-2">
            <StatusBadge value={booking.status} />
            <StatusBadge value={booking.paymentStatus} />
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-5">
          <section className="rounded-2xl border border-line bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-mute">
                  {booking.kind === 'stay' ? 'Stay' : 'Experience'}
                </p>
                <h2 className="mt-1 font-display text-[21px] font-semibold tracking-[-0.025em] text-ink">
                  {booking.itemName}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-mute">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {location}
                </p>
              </div>
              <Link
                href={`/${booking.kind === 'stay' ? 'stays' : 'experiences'}/${booking.itemSlug}`}
                target="_blank"
                className="btn-outline !px-4 !py-2 !text-[12px]"
              >
                View listing
              </Link>
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-4 text-[12.5px] text-mute">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4 text-forest" strokeWidth={1.8} />
                {booking.kind === 'stay'
                  ? `${formatRange(booking.checkIn, booking.checkOut)} · ${booking.nights} ${
                      booking.nights === 1 ? 'night' : 'nights'
                    }`
                  : formatLongDay(booking.checkIn)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-forest" strokeWidth={1.8} />
                {booking.guests} {booking.guests === 1 ? 'guest' : 'guests'}
              </span>
            </div>

            <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[13px]">
              <div className="flex items-center justify-between text-mute">
                <dt>
                  {rwf(booking.unitPrice)} ×{' '}
                  {booking.kind === 'stay'
                    ? `${booking.nights} ${booking.nights === 1 ? 'night' : 'nights'}`
                    : `${booking.guests} ${booking.guests === 1 ? 'guest' : 'guests'}`}
                </dt>
                <dd className="font-medium text-ink">{rwf(booking.subtotal)}</dd>
              </div>
              <div className="flex items-center justify-between text-mute">
                <dt>Service fee</dt>
                <dd className="font-medium text-ink">{rwf(booking.serviceFee)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-2.5 text-[14.5px] font-semibold text-forest">
                <dt>Total</dt>
                <dd>{rwf(booking.total)}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
              Guest
            </h2>
            <dl className="mt-3 grid gap-3 text-[13px] sm:grid-cols-2">
              <div>
                <dt className="text-[11px] text-mute">Name</dt>
                <dd className="font-medium text-ink">{booking.guestName}</dd>
              </div>
              <div>
                <dt className="text-[11px] text-mute">Phone</dt>
                <dd className="font-medium text-ink">{booking.guestPhone}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-[11px] text-mute">Email</dt>
                <dd className="flex flex-wrap items-center gap-2 font-medium text-ink">
                  <span className="break-all">{booking.guestEmail}</span>
                  <a
                    href={`mailto:${booking.guestEmail}`}
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-forest"
                  >
                    <Mail className="h-3.5 w-3.5" />
                    Email
                  </a>
                  <a
                    href={`https://wa.me/${booking.guestPhone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-forest"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    WhatsApp
                  </a>
                </dd>
              </div>
              {booking.notes ? (
                <div className="sm:col-span-2">
                  <dt className="text-[11px] text-mute">Guest notes</dt>
                  <dd className="mt-1 rounded-lg bg-soft px-3 py-2 text-[12.5px] leading-relaxed text-mute">
                    {booking.notes}
                  </dd>
                </div>
              ) : null}
            </dl>
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
              <ReceiptText className="h-4 w-4 text-forest" strokeWidth={1.8} />
              Payments
            </h2>
            {booking.payments.length ? (
              <div className="mt-3 overflow-x-auto">
                <table className="w-full min-w-[440px] text-left text-[12.5px]">
                  <thead>
                    <tr className="border-b border-line text-[10px] uppercase tracking-[0.12em] text-mute">
                      <th className="py-2 pr-3 font-semibold">Method</th>
                      <th className="px-3 py-2 font-semibold">Amount</th>
                      <th className="px-3 py-2 font-semibold">Status</th>
                      <th className="px-3 py-2 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line">
                    {booking.payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-2.5 pr-3">
                          <span className="flex items-center gap-1.5 font-medium text-ink">
                            <CreditCard className="h-3.5 w-3.5 text-mute" />
                            {METHOD_LABEL[payment.method] ?? payment.method}
                          </span>
                          <span className="text-[10.5px] text-mute">{payment.provider}</span>
                        </td>
                        <td className="px-3 py-2.5 font-medium text-ink">{rwf(payment.amount)}</td>
                        <td className="px-3 py-2.5">
                          <StatusBadge value={payment.status} />
                          {payment.failureReason ? (
                            <p className="mt-1 text-[10.5px] text-clay">{payment.failureReason}</p>
                          ) : null}
                        </td>
                        <td className="px-3 py-2.5 text-[11.5px] text-mute">
                          {formatTimestamp(payment.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="mt-2 text-[12.5px] text-mute">
                No payment attempts yet. The guest has not started checkout.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-line bg-white p-5">
            <h2 className="flex items-center gap-2 font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
              <Clock3 className="h-4 w-4 text-forest" strokeWidth={1.8} />
              Activity
            </h2>
            {events.length ? (
              <ol className="mt-4 space-y-3">
                {events.map((event, index) => (
                  <li key={`${event.type}-${event.created_at}-${index}`} className="flex gap-3">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-forest/60" />
                    <div>
                      <p className="text-[12.5px] font-medium capitalize text-ink">
                        {event.type.replace(/_/g, ' ')}
                      </p>
                      {event.detail ? (
                        <p className="text-[11.5px] text-mute">{event.detail}</p>
                      ) : null}
                      <p className="text-[10.5px] text-mute/70">
                        {formatTimestamp(event.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="mt-2 text-[12.5px] text-mute">No activity recorded yet.</p>
            )}
          </section>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-6 lg:self-start">
          <BookingAdminForm
            reference={booking.reference}
            status={booking.status}
            paymentStatus={booking.paymentStatus}
          />

          <section className="rounded-2xl border border-line bg-white p-5 text-[12px] leading-relaxed text-mute">
            <h2 className="font-display text-[15px] font-semibold text-ink">Looking up the details</h2>
            <p className="mt-2">
              The guest can open this booking at{' '}
              <span className="font-mono text-[11.5px] text-ink">/bookings/{booking.reference}</span>{' '}
              on the public site.
            </p>
            <p className="mt-2">
              Paid bookings cannot be cancelled by the guest. Use the payment status here if you
              have issued a refund outside the app.
            </p>
          </section>
        </aside>
      </div>
    </div>
  );
}
