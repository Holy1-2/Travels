'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, CalendarDays, Minus, Plus, ShieldCheck, Sparkles } from 'lucide-react';
import { addDays, cn, formatLongDay, formatRange, nightsBetween, rwf, todayISO } from '@/lib/utils';

type StayBooking = {
  kind: 'stay';
  slug: string;
  price: number;
  capacity: number;
  initialCheckIn?: string;
  initialCheckOut?: string;
  initialGuests?: number;
};

type ExperienceBooking = {
  kind: 'experience';
  slug: string;
  price: number;
  name: string;
  groupSize: string;
  initialDate?: string;
  initialGuests?: number;
};

export type BookingPanelProps = (StayBooking | ExperienceBooking) & { className?: string };

function defaultCheckIn() {
  return addDays(todayISO(), 7);
}

function clampGuests(value: number | undefined, min: number, max: number) {
  if (!value || Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

export default function BookingPanel(props: BookingPanelProps) {
  const router = useRouter();
  const tomorrow = todayISO();

  const isStay = props.kind === 'stay';
  const stayProps = props.kind === 'stay' ? props : null;
  const expProps = props.kind === 'experience' ? props : null;

  const [checkIn, setCheckIn] = useState(() => stayProps?.initialCheckIn ?? defaultCheckIn());
  const [checkOut, setCheckOut] = useState(
    () => stayProps?.initialCheckOut ?? addDays(stayProps?.initialCheckIn ?? defaultCheckIn(), 2)
  );
  const [visitDate, setVisitDate] = useState(() => expProps?.initialDate ?? defaultCheckIn());
  const [guests, setGuests] = useState(() =>
    clampGuests(isStay ? stayProps?.initialGuests : expProps?.initialGuests, 1, isStay ? 6 : 10)
  );

  const maxGuests = isStay ? Math.min(stayProps?.capacity ?? 2, 6) : 10;
  const nights = nightsBetween(checkIn, checkOut);

  const totals = useMemo(() => {
    if (isStay) {
      const subtotal = props.price * Math.max(nights, 1);
      const service = Math.round(subtotal * 0.05);
      return { subtotal, service, total: subtotal + service };
    }
    const subtotal = props.price * guests;
    const service = Math.round(subtotal * 0.03);
    return { subtotal, service, total: subtotal + service };
  }, [isStay, props.price, nights, guests]);

  const dateInvalid = isStay ? !checkIn || !checkOut || checkOut <= checkIn : !visitDate;

  const submit = () => {
    if (dateInvalid) return;
    const params = new URLSearchParams();
    params.set('kind', isStay ? 'stay' : 'experience');
    params.set('slug', props.slug);
    params.set('guests', String(guests));
    if (isStay) {
      params.set('checkin', checkIn);
      params.set('checkout', checkOut);
    } else {
      params.set('date', visitDate);
    }
    router.push(`/checkout?${params.toString()}`);
  };

  const changeGuests = (delta: number) => {
    setGuests((value) => Math.max(1, Math.min(maxGuests, value + delta)));
  };

  return (
    <aside
      className={cn(
        'overflow-hidden rounded-2xl border border-line bg-white shadow-lift',
        props.className
      )}
    >
      <div className="border-b border-line bg-soft/70 px-6 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-forest/60">
          {isStay ? 'Reserve your stay' : 'Reserve this experience'}
        </p>
        <p className="mt-1.5 flex items-baseline gap-1.5">
          <span className="font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-ink">{rwf(props.price)}</span>
          <span className="text-[13.5px] text-mute">{isStay ? '/ night' : '/ person'}</span>
        </p>
        {!isStay ? (
          <p className="mt-1 text-[12.5px] text-mute">
            {expProps?.groupSize} · secure online payment
          </p>
        ) : null}
      </div>

      <div className="px-6 py-5">
        {isStay ? (
          <div className="grid grid-cols-2 gap-2.5">
            <label className="rounded-2xl border border-line px-3.5 py-2.5 transition focus-within:border-pine/50 focus-within:ring-4 focus-within:ring-pine/10">
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest/60">
                <CalendarDays className="h-3 w-3" />
                Check in
              </span>
              <input
                type="date"
                value={checkIn}
                min={tomorrow}
                onChange={(event) => {
                  const value = event.target.value;
                  setCheckIn(value);
                  if (value && (!checkOut || checkOut <= value)) setCheckOut(addDays(value, 2));
                }}
                className="mt-1 w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-medium text-ink outline-none"
              />
            </label>
            <label className="rounded-2xl border border-line px-3.5 py-2.5 transition focus-within:border-pine/50 focus-within:ring-4 focus-within:ring-pine/10">
              <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest/60">
                <CalendarDays className="h-3 w-3" />
                Check out
              </span>
              <input
                type="date"
                value={checkOut}
                min={checkIn ? addDays(checkIn, 1) : tomorrow}
                onChange={(event) => setCheckOut(event.target.value)}
                className="mt-1 w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-medium text-ink outline-none"
              />
            </label>
          </div>
        ) : (
          <label className="block rounded-2xl border border-line px-3.5 py-2.5 transition focus-within:border-pine/50 focus-within:ring-4 focus-within:ring-pine/10">
            <span className="flex items-center gap-1.5 text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest/60">
              <CalendarDays className="h-3 w-3" />
              Preferred date
            </span>
            <input
              type="date"
              value={visitDate}
              min={tomorrow}
              onChange={(event) => setVisitDate(event.target.value)}
              className="mt-1 w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-medium text-ink outline-none"
            />
          </label>
        )}

        <div className="mt-3 flex items-center justify-between rounded-2xl border border-line px-3.5 py-2.5">
          <div>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-forest/60">
              Guests
            </p>
            <p className="mt-0.5 text-[14px] font-medium text-ink">
              {guests} {guests === 1 ? 'guest' : 'guests'}
              {isStay ? (
                <span className="text-mute"> · sleeps {stayProps?.capacity}</span>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => changeGuests(-1)}
              disabled={guests <= 1}
              aria-label="Remove a guest"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => changeGuests(1)}
              disabled={guests >= maxGuests}
              aria-label="Add a guest"
              className="grid h-8 w-8 place-items-center rounded-full border border-line text-forest transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {dateInvalid ? (
          <p className="mt-3 text-[12.5px] font-medium text-clay" role="alert">
            {isStay
              ? 'Check-out needs to be after check-in.'
              : 'Choose a date for your experience.'}
          </p>
        ) : null}

        <dl className="mt-5 space-y-2.5 text-[14px]">
          <div className="flex items-center justify-between text-mute">
            <dt>
              {isStay
                ? `${rwf(props.price)} × ${Math.max(nights, 1)} ${nights === 1 ? 'night' : 'nights'}`
                : `${rwf(props.price)} × ${guests} ${guests === 1 ? 'guest' : 'guests'}`}
            </dt>
            <dd className="font-medium text-ink">{rwf(totals.subtotal)}</dd>
          </div>
          <div className="flex items-center justify-between text-mute">
            <dt>{isStay ? 'Community & service fee' : 'Booking fee'}</dt>
            <dd className="font-medium text-ink">{rwf(totals.service)}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-3 text-[15px] font-semibold text-forest">
            <dt>Total</dt>
            <dd>{rwf(totals.total)}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={submit}
          disabled={dateInvalid}
          className="btn-primary mt-5 w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to checkout
          <ArrowRight className="h-4 w-4" />
        </button>

        <p className="mt-3 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-mute">
          <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-pine" />
          Pay securely in the app with MTN MoMo, Airtel Money, Visa or Mastercard. Your dates are
          held while you complete payment.
        </p>

        {isStay && !dateInvalid ? (
          <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-mute">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {formatRange(checkIn, checkOut)} · {nights} {nights === 1 ? 'night' : 'nights'} in
            Rwanda
          </p>
        ) : null}
        {!isStay && visitDate ? (
          <p className="mt-2.5 flex items-center gap-1.5 text-[11.5px] text-mute">
            <Sparkles className="h-3.5 w-3.5 text-gold" />
            {formatLongDay(visitDate)} · guide confirmed the day before
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3 border-t border-line bg-soft/60 px-6 py-4">
        <ShieldCheck className="h-5 w-5 shrink-0 text-forest" strokeWidth={1.7} />
        <p className="text-[12px] leading-snug text-mute">
          Free cancellation up to 72 hours before arrival. Our Kigali team answers in English,
          Kinyarwanda and French.
        </p>
      </div>
    </aside>
  );
}
