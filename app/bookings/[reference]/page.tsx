import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  ReceiptText,
  ShieldCheck,
  Users,
} from 'lucide-react';
import BookingStatusActions from '@/components/BookingStatusActions';
import { getBooking } from '@/lib/server/bookings';
import { getExperienceBySlug, getStayBySlug } from '@/lib/server/content';
import { firstParam, formatDay, formatLongDay, formatRange, rwf } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Your booking',
  robots: { index: false, follow: false },
};

const METHOD_LABEL: Record<string, string> = {
  card: 'Visa / Mastercard',
  mtn: 'MTN MoMo',
  airtel: 'Airtel Money',
};

const PAYMENT_LABEL: Record<string, string> = {
  unpaid: 'Awaiting payment',
  processing: 'Payment processing',
  paid: 'Paid',
  failed: 'Payment failed',
  refunded: 'Refunded',
};

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ reference: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { reference } = await params;
  const query = await searchParams;
  const booking = getBooking(reference);
  if (!booking) notFound();

  const stay = booking.kind === 'stay' ? getStayBySlug(booking.itemSlug) : undefined;
  const experience =
    booking.kind === 'experience' ? getExperienceBySlug(booking.itemSlug) : undefined;
  const image = stay?.images[0] ?? experience?.image ?? '/images/hero/hero-tea.jpg';
  const location = stay?.location ?? experience?.meetingPoint ?? 'Rwanda';
  const cancelled = booking.status === 'cancelled';
  const paid = booking.paymentStatus === 'paid';
  const processing = booking.paymentStatus === 'processing';
  const lastPayment = booking.payments[0];

  const banner = cancelled
    ? {
        icon: AlertCircle,
        tone: 'border-clay/25 bg-clay/5 text-clay',
        eyebrow: 'Booking cancelled',
        title: 'This booking has been cancelled.',
        copy: 'The dates have been released. If this was a mistake, start a new booking or contact our team.',
      }
    : paid
      ? {
          icon: BadgeCheck,
          tone: 'border-forest/20 bg-forest/[0.05] text-forest',
          eyebrow: 'Payment received',
          title: "You're booked.",
          copy: 'Your stay is confirmed and the host has been notified. Arrival details will follow by email.',
        }
      : processing
        ? {
            icon: Clock3,
            tone: 'border-gold/30 bg-gold/[0.07] text-ink',
            eyebrow: 'Payment pending',
            title: 'Waiting for the payment to clear.',
            copy: lastPayment?.method === 'card'
              ? 'Your card payment is being verified. This page updates automatically.'
              : 'Approve the prompt on your phone. This page updates automatically once the payment clears.',
          }
        : {
            icon: AlertCircle,
            tone: 'border-clay/25 bg-clay/5 text-clay',
            eyebrow: booking.paymentStatus === 'failed' ? 'Payment failed' : 'Almost there',
            title:
              booking.paymentStatus === 'failed'
                ? 'The last payment did not go through.'
                : 'One step left: complete your payment.',
            copy: 'Your dates are held for 30 minutes. Choose MoMo, Airtel Money or card to confirm the booking.',
          };
  const BannerIcon = banner.icon;

  return (
    <div className="wrap py-10 lg:py-14">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
            Find another booking
          </Link>
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-[12px]">
            <span className="text-mute">Reference</span>
            <strong className="font-semibold tracking-wide text-ink">{booking.reference}</strong>
          </p>
        </div>

        {query.payment === 'cancelled' ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-line bg-soft px-4 py-3 text-[13px] text-mute">
            <AlertCircle className="h-4 w-4 shrink-0" />
            The payment was cancelled. You can try again below.
          </p>
        ) : null}
        {query.payment === 'pending' ? (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/[0.07] px-4 py-3 text-[13px] text-ink">
            <Clock3 className="h-4 w-4 shrink-0" />
            We are still confirming the payment with the provider. This page will update shortly.
          </p>
        ) : null}

        <div className={`mt-5 rounded-2xl border p-6 sm:p-7 ${banner.tone}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-white/80">
                <BannerIcon className="h-5 w-5" strokeWidth={1.9} />
              </span>
              <div>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] opacity-70">
                  {banner.eyebrow}
                </p>
                <h1 className="mt-1.5 font-display text-[clamp(26px,3.6vw,36px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
                  {banner.title}
                </h1>
                <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-mute">
                  {banner.copy}
                </p>
              </div>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-semibold text-ink">
              {paid ? <Check className="h-3.5 w-3.5 text-forest" /> : null}
              {PAYMENT_LABEL[booking.paymentStatus]}
            </span>
          </div>

          <div className="mt-5">
            <BookingStatusActions
              reference={booking.reference}
              email={booking.guestEmail}
              paymentStatus={booking.paymentStatus}
              status={booking.status}
            />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="overflow-hidden rounded-2xl border border-line bg-white">
            <div className="flex flex-col sm:flex-row">
              <div className="relative aspect-[16/10] w-full bg-mist sm:aspect-auto sm:w-52 sm:shrink-0">
                <Image
                  src={image}
                  alt={booking.itemName}
                  fill
                  sizes="(max-width: 640px) 100vw, 208px"
                  className="object-cover"
                />
              </div>
              <div className="flex-1 p-5">
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                  {booking.kind === 'stay' ? 'Stay' : 'Experience'}
                </p>
                <h2 className="mt-1 font-display text-[20px] font-semibold tracking-[-0.02em] text-ink">
                  {booking.itemName}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-[13px] text-mute">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {location}
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[13px] text-mute">
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
                <Link
                  href={`/${booking.kind === 'stay' ? 'stays' : 'experiences'}/${booking.itemSlug}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4"
                >
                  View the listing
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            <dl className="space-y-2.5 border-t border-line px-5 py-5 text-[14px]">
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
                <dt>{booking.kind === 'stay' ? 'Community & service fee' : 'Booking fee'}</dt>
                <dd className="font-medium text-ink">{rwf(booking.serviceFee)}</dd>
              </div>
              <div className="flex items-center justify-between border-t border-line pt-3 text-[15px] font-semibold text-forest">
                <dt>Total</dt>
                <dd>{rwf(booking.total)}</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                Guest details
              </p>
              <dl className="mt-3 space-y-2.5 text-[13.5px]">
                <div>
                  <dt className="text-[11.5px] text-mute">Name</dt>
                  <dd className="font-medium text-ink">{booking.guestName}</dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-mute">Email</dt>
                  <dd className="break-all font-medium text-ink">{booking.guestEmail}</dd>
                </div>
                <div>
                  <dt className="text-[11.5px] text-mute">Phone</dt>
                  <dd className="font-medium text-ink">{booking.guestPhone}</dd>
                </div>
                {booking.notes ? (
                  <div>
                    <dt className="text-[11.5px] text-mute">Notes</dt>
                    <dd className="rounded-lg bg-soft px-3 py-2 text-[12.5px] leading-relaxed text-mute">
                      {booking.notes}
                    </dd>
                  </div>
                ) : null}
              </dl>
            </div>

            <div className="rounded-2xl border border-line bg-white p-5">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                <ReceiptText className="h-3.5 w-3.5" />
                Payment
              </p>
              {booking.payments.length ? (
                <ul className="mt-3 space-y-2.5">
                  {booking.payments.map((payment) => (
                    <li
                      key={payment.id}
                      className="flex items-start justify-between gap-3 border-b border-line/70 pb-2.5 text-[12.5px] last:border-0 last:pb-0"
                    >
                      <div>
                        <p className="font-medium text-ink">{METHOD_LABEL[payment.method]}</p>
                        <p className="text-[11px] text-mute">
                          {new Date(payment.createdAt).toLocaleString('en-GB', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                      <span className="text-right">
                        <span className="block font-semibold text-ink">{rwf(payment.amount)}</span>
                        <span className="text-[10.5px] capitalize text-mute">{payment.status}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-[12.5px] leading-relaxed text-mute">
                  No payment attempts yet. Choose a method to confirm the booking.
                </p>
              )}
            </div>

            <div className="rounded-2xl bg-soft p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                Need a hand?
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-mute">
                Our Kigali team replies in English, Kinyarwanda and French.
              </p>
              <a
                href="mailto:hello@hamubere.com"
                className="mt-3 flex items-center gap-2 text-[13px] font-semibold text-forest"
              >
                <Mail className="h-4 w-4" />
                hello@hamubere.com
              </a>
              <a
                href="https://wa.me/250788000000"
                target="_blank"
                rel="noreferrer noopener"
                className="mt-2 flex items-center gap-2 text-[13px] font-semibold text-forest"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp the team
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: 'Protected booking',
              copy: 'Payments are verified with the provider before a booking is marked paid.',
            },
            {
              icon: CalendarDays,
              title: 'Free changes',
              copy: 'Cancel or reschedule up to 72 hours before arrival — contact us for paid bookings.',
            },
            {
              icon: BadgeCheck,
              title: 'Locally vetted',
              copy: 'Every stay and guide is visited and checked by our team in Rwanda.',
            },
          ].map((entry) => {
            const Icon = entry.icon;
            return (
              <div key={entry.title} className="rounded-2xl border border-line p-4">
                <Icon className="h-4 w-4 text-forest" strokeWidth={1.8} />
                <p className="mt-3 text-[13.5px] font-semibold text-ink">{entry.title}</p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{entry.copy}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-8 text-center text-[11.5px] text-mute">
          Booked {formatDay(booking.createdAt.slice(0, 10))} · Reference {booking.reference} · Prices
          in {booking.currency}
        </p>
      </div>
    </div>
  );
}
