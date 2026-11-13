'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  CreditCard,
  Loader2,
  Lock,
  MapPin,
  ShieldCheck,
  Smartphone,
  Users,
} from 'lucide-react';
import type { PaymentMethod, PublicBooking } from '@/lib/server/types';
import { formatLongDay, formatRange, rwf } from '@/lib/utils';

export interface CheckoutItem {
  kind: 'stay' | 'experience';
  slug: string;
  name: string;
  location: string;
  image: string;
  unitPrice: number;
  capacity: number;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  nights: number;
  duration?: string;
}

interface CheckoutFlowProps {
  item: CheckoutItem;
  booking?: PublicBooking | null;
  sandbox: boolean;
}

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5';

const labelClass = 'block text-[12.5px] font-medium text-ink';

const METHODS: Array<{
  id: PaymentMethod;
  title: string;
  note: string;
  icon: typeof Smartphone;
}> = [
  { id: 'mtn', title: 'MTN MoMo', note: 'Approve the prompt on your phone', icon: Smartphone },
  { id: 'airtel', title: 'Airtel Money', note: 'Approve the prompt on your phone', icon: Smartphone },
  { id: 'card', title: 'Visa / Mastercard', note: 'Secure hosted card checkout', icon: CreditCard },
];

export default function CheckoutFlow({ item, booking: initialBooking, sandbox }: CheckoutFlowProps) {
  const router = useRouter();
  const [booking, setBooking] = useState<PublicBooking | null>(initialBooking ?? null);
  const [creating, setCreating] = useState(false);
  const [paying, setPaying] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [method, setMethod] = useState<PaymentMethod>('mtn');
  const [phone, setPhone] = useState(initialBooking?.guestPhone ?? '');
  const [pendingPaymentId, setPendingPaymentId] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);

  const totals = useMemo(() => {
    if (booking) {
      return {
        subtotal: booking.subtotal,
        fee: booking.serviceFee,
        total: booking.total,
        unitPrice: booking.unitPrice,
        guests: booking.guests,
        nights: booking.nights,
      };
    }

    const units = item.kind === 'stay' ? Math.max(item.nights, 1) : item.guests;
    const subtotal = item.unitPrice * units;
    const fee = Math.round(subtotal * (item.kind === 'stay' ? 0.05 : 0.03));
    return {
      subtotal,
      fee,
      total: subtotal + fee,
      unitPrice: item.unitPrice,
      guests: item.guests,
      nights: item.nights,
    };
  }, [booking, item]);

  useEffect(() => {
    if (!polling || !booking) return;

    const reference = booking.reference;
    const tick = async () => {
      try {
        const response = await fetch(`/api/bookings/${reference}`, { cache: 'no-store' });
        const payload = await response.json();
        if (!response.ok || !payload.booking) return;

        if (payload.booking.paymentStatus === 'paid') {
          setPolling(false);
          router.push(`/bookings/${reference}?payment=success`);
        } else if (payload.booking.paymentStatus === 'failed') {
          setPolling(false);
          setBooking(payload.booking);
          setError('The payment did not go through. You can try again with another method.');
        }
      } catch {
        // Keep polling; a transient network error should not cancel the attempt.
      }
    };

    const interval = window.setInterval(tick, 5000);
    return () => window.clearInterval(interval);
  }, [polling, booking, router]);

  async function createBooking(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setCreating(true);

    const data = new FormData(event.currentTarget);
    const payload = {
      kind: item.kind,
      slug: item.slug,
      checkIn: item.checkIn,
      checkOut: item.kind === 'stay' ? item.checkOut : null,
      guests: item.guests,
      guest: {
        name: String(data.get('name') ?? ''),
        email: String(data.get('email') ?? ''),
        phone: String(data.get('phone') ?? ''),
      },
      notes: String(data.get('notes') ?? ''),
    };

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'We could not hold those dates. Please check the details.');
        return;
      }

      setBooking(result.booking);
      setPhone(result.booking.guestPhone ?? '');
      window.history.replaceState(null, '', `/checkout?reference=${result.booking.reference}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setCreating(false);
    }
  }

  async function startPayment() {
    if (!booking) return;
    setError('');
    setMessage('');
    setPaying(true);

    try {
      const response = await fetch(`/api/bookings/${booking.reference}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          method,
          phone: method === 'card' ? undefined : phone,
        }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'The payment could not be started.');
        return;
      }

      setBooking(result.booking ?? booking);
      setMessage(result.message ?? '');

      if (result.sandbox) {
        setPendingPaymentId(result.payment?.id ?? null);
        return;
      }

      if (method === 'card' && result.checkoutUrl) {
        window.location.assign(result.checkoutUrl);
        return;
      }

      setPolling(true);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setPaying(false);
    }
  }

  async function confirmTestPayment() {
    if (!booking || !pendingPaymentId) return;
    setError('');
    setConfirming(true);

    try {
      const response = await fetch(`/api/payments/${booking.reference}/confirm`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId: pendingPaymentId }),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'The test payment could not be confirmed.');
        return;
      }

      setPolling(false);
      router.push(`/bookings/${booking.reference}?payment=success`);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setConfirming(false);
    }
  }

  const step = booking ? 2 : 1;

  return (
    <div className="wrap py-10 lg:py-14">
      <Link
        href={booking ? `/bookings/${booking.reference}` : `/${item.kind === 'stay' ? 'stays' : 'experiences'}/${item.slug}`}
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
      >
        <ChevronLeft className="h-4 w-4" />
        {booking ? 'Back to your booking' : 'Back to the listing'}
      </Link>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Secure checkout</p>
          <h1 className="mt-3 font-display text-[clamp(30px,4.2vw,44px)] font-semibold leading-[1.05] tracking-[-0.04em] text-ink">
            {booking?.paymentStatus === 'paid' ? 'Already paid.' : 'Finish your reservation.'}
          </h1>
        </div>
        <ol className="flex items-center gap-2 text-[12px] font-medium text-mute">
          {[
            { number: 1, label: 'Your details' },
            { number: 2, label: 'Payment' },
            { number: 3, label: 'Confirmed' },
          ].map((entry) => {
            const active = entry.number === step;
            const done = entry.number < step;
            return (
              <li key={entry.number} className="flex items-center gap-2">
                <span
                  className={`grid h-6 w-6 place-items-center rounded-full border text-[11px] ${
                    active
                      ? 'border-forest bg-forest text-white'
                      : done
                        ? 'border-forest/30 bg-forest/10 text-forest'
                        : 'border-line bg-white text-mute'
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : entry.number}
                </span>
                <span className={active ? 'text-ink' : ''}>{entry.label}</span>
                {entry.number < 3 ? <span className="h-px w-5 bg-line" /> : null}
              </li>
            );
          })}
        </ol>
      </div>

      {sandbox ? (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-clay/25 bg-clay/5 px-4 py-3 text-[12.5px] leading-relaxed text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" strokeWidth={1.9} />
          <p>
            <strong className="font-semibold">Test payments are on.</strong> No live payment keys are
            configured, so no real money is charged. Add your Flutterwave keys to{' '}
            <code className="rounded bg-white px-1 py-0.5 text-[11.5px]">.env.local</code> to accept
            live MoMo, Airtel Money and card payments.
          </p>
        </div>
      ) : (
        <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-forest/15 bg-forest/[0.04] px-4 py-3 text-[12.5px] leading-relaxed text-ink">
          <Lock className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.9} />
          <p>
            Payments are processed securely by Flutterwave. Card details never touch our servers,
            and MoMo / Airtel payments are approved on your phone.
          </p>
        </div>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_390px] lg:gap-12">
        <div>
          {!booking ? (
            <form onSubmit={createBooking} className="rounded-2xl border border-line bg-white p-6 sm:p-7">
              <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                Who is travelling?
              </h2>
              <p className="mt-1 text-[13.5px] text-mute">
                We use these details for your confirmation and the host&apos;s arrival notes.
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <label className={`${labelClass} sm:col-span-2`}>
                  Full name
                  <input
                    name="name"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    placeholder="e.g. Aline Uwase"
                    className={inputClass}
                  />
                </label>

                <label className={labelClass}>
                  Email
                  <input
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={inputClass}
                  />
                </label>

                <label className={labelClass}>
                  Phone / WhatsApp
                  <input
                    name="phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+250 7xx xxx xxx"
                    className={inputClass}
                  />
                </label>

                <label className={`${labelClass} sm:col-span-2`}>
                  Anything the host should know?
                  <textarea
                    name="notes"
                    rows={3}
                    maxLength={1000}
                    placeholder="Arrival time, dietary needs, a special occasion…"
                    className={`${inputClass} resize-y`}
                  />
                </label>
              </div>

              <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="flex items-start gap-2 text-[12px] leading-relaxed text-mute">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
                  Dates are held for 30 minutes while you pay.
                </p>
                <button type="submit" disabled={creating} className="btn-primary shrink-0">
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Holding your dates
                    </>
                  ) : (
                    <>
                      Continue to payment
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="rounded-2xl border border-line bg-white p-6 sm:p-7">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                      Choose how to pay
                    </h2>
                    <p className="mt-1 text-[13.5px] text-mute">
                      Booking {booking.reference} · {rwf(booking.total)}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-soft px-3 py-1.5 text-[11px] font-medium text-ink">
                    <Lock className="h-3 w-3 text-forest" />
                    Encrypted
                  </span>
                </div>

                <div className="mt-5 grid gap-2.5">
                  {METHODS.map((entry) => {
                    const Icon = entry.icon;
                    const active = method === entry.id;
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => setMethod(entry.id)}
                        aria-pressed={active}
                        className={`flex items-center gap-3.5 rounded-xl border p-4 text-left transition ${
                          active
                            ? 'border-forest bg-forest/[0.04] ring-1 ring-forest/20'
                            : 'border-line bg-white hover:border-ink/20'
                        }`}
                      >
                        <span
                          className={`grid h-9 w-9 shrink-0 place-items-center rounded-full ${
                            active ? 'bg-forest text-white' : 'bg-soft text-forest'
                          }`}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.8} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[14px] font-semibold text-ink">{entry.title}</span>
                          <span className="mt-0.5 block text-[12px] text-mute">{entry.note}</span>
                        </span>
                        <span
                          className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border ${
                            active ? 'border-forest bg-forest' : 'border-line bg-white'
                          }`}
                        >
                          {active ? <Check className="h-2.5 w-2.5 text-white" /> : null}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {method !== 'card' ? (
                  <label className={`${labelClass} mt-5`}>
                    Mobile money number
                    <input
                      type="tel"
                      value={phone}
                      onChange={(event) => setPhone(event.target.value)}
                      autoComplete="tel"
                      placeholder="+250 7xx xxx xxx"
                      className={inputClass}
                    />
                    <span className="mt-1.5 block text-[11.5px] text-mute">
                      Use the number registered with {method === 'mtn' ? 'MTN MoMo' : 'Airtel Money'}.
                    </span>
                  </label>
                ) : null}

                {pendingPaymentId ? (
                  <div className="mt-5 rounded-xl border border-forest/20 bg-forest/[0.04] p-4">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                      <BadgeCheck className="h-4 w-4 text-forest" />
                      Test payment ready
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-mute">
                      Confirm the test payment to mark booking {booking.reference} as paid. No money
                      moves.
                    </p>
                    <button
                      type="button"
                      onClick={confirmTestPayment}
                      disabled={confirming}
                      className="btn-primary mt-3 w-full"
                    >
                      {confirming ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Confirming
                        </>
                      ) : (
                        <>
                          Pay {rwf(booking.total)} in test mode
                          <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                ) : polling ? (
                  <div className="mt-5 rounded-xl border border-line bg-soft/70 p-4">
                    <p className="flex items-center gap-2 text-[13.5px] font-semibold text-ink">
                      <Loader2 className="h-4 w-4 animate-spin text-forest" />
                      Waiting for your approval
                    </p>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-mute">{message}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setPolling(false);
                        void startPayment();
                      }}
                      className="mt-3 text-[12.5px] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4"
                    >
                      Send the prompt again
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={startPayment}
                    disabled={paying || (method !== 'card' && !phone.trim())}
                    className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Starting payment
                      </>
                    ) : (
                      <>
                        Pay {rwf(booking.total)}
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}

                <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-mute">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-forest" />
                  Free cancellation up to 72 hours before arrival. Refunds return to the original
                  payment method.
                </p>
              </div>

              <div className="rounded-2xl border border-line bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
                  Travelling as
                </p>
                <p className="mt-2 text-[14px] font-medium text-ink">{booking.guestName}</p>
                <p className="text-[13px] text-mute">
                  {booking.guestEmail} · {booking.guestPhone}
                </p>
                {booking.notes ? (
                  <p className="mt-2 rounded-lg bg-soft px-3 py-2 text-[12.5px] leading-relaxed text-mute">
                    {booking.notes}
                  </p>
                ) : null}
                <Link
                  href={`/bookings/${booking.reference}`}
                  className="mt-3 inline-flex items-center gap-1.5 text-[12.5px] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4"
                >
                  View booking details
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          )}

          {error ? (
            <div
              role="alert"
              className="mt-4 flex items-start gap-2.5 rounded-xl border border-clay/30 bg-clay/5 px-4 py-3 text-[13px] leading-relaxed text-ink"
            >
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
              {error}
            </div>
          ) : null}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-soft">
            <div className="relative aspect-[16/9] bg-mist">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 1024px) 100vw, 390px"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">
                {item.kind === 'stay' ? 'Your stay' : 'Your experience'}
              </p>
              <h2 className="mt-1 font-display text-[19px] font-semibold tracking-[-0.02em] text-ink">
                {item.name}
              </h2>
              <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-mute">
                <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                {item.location}
              </p>

              <div className="mt-4 space-y-2 border-t border-line pt-4 text-[12.5px] text-mute">
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {item.kind === 'stay'
                    ? formatRange(booking?.checkIn ?? item.checkIn, booking?.checkOut ?? item.checkOut)
                    : formatLongDay(booking?.checkIn ?? item.checkIn)}
                  {item.kind === 'stay' && totals.nights
                    ? ` · ${totals.nights} ${totals.nights === 1 ? 'night' : 'nights'}`
                    : ''}
                </p>
                <p className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-forest" strokeWidth={1.8} />
                  {totals.guests} {totals.guests === 1 ? 'guest' : 'guests'}
                  {item.duration ? ` · ${item.duration}` : ''}
                </p>
              </div>

              <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-[13.5px]">
                <div className="flex items-center justify-between text-mute">
                  <dt>
                    {rwf(totals.unitPrice)} ×{' '}
                    {item.kind === 'stay'
                      ? `${Math.max(totals.nights, 1)} ${totals.nights === 1 ? 'night' : 'nights'}`
                      : `${totals.guests} ${totals.guests === 1 ? 'guest' : 'guests'}`}
                  </dt>
                  <dd className="font-medium text-ink">{rwf(totals.subtotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-mute">
                  <dt>{item.kind === 'stay' ? 'Community & service fee' : 'Booking fee'}</dt>
                  <dd className="font-medium text-ink">{rwf(totals.fee)}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-line pt-3 text-[15px] font-semibold text-forest">
                  <dt>Total</dt>
                  <dd>{rwf(totals.total)}</dd>
                </div>
              </dl>
            </div>

            <div className="flex items-start gap-2.5 border-t border-line bg-soft/60 px-5 py-4">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
              <p className="text-[11.5px] leading-snug text-mute">
                Your booking is confirmed the moment payment succeeds. A receipt and arrival details
                follow by email.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
