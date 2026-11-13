'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Check, Loader2 } from 'lucide-react';
import type { BookingPaymentStatus, BookingStatus } from '@/lib/server/types';

const STATUSES: BookingStatus[] = ['pending', 'confirmed', 'cancelled', 'completed'];
const PAYMENT_STATUSES: BookingPaymentStatus[] = [
  'unpaid',
  'processing',
  'paid',
  'failed',
  'refunded',
];

const selectClass =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] capitalize text-ink outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-forest/5';

export default function BookingAdminForm({
  reference,
  status,
  paymentStatus,
}: {
  reference: string;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
}) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<BookingStatus>(status);
  const [nextPayment, setNextPayment] = useState<BookingPaymentStatus>(paymentStatus);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setSaved(false);

    try {
      const response = await fetch(`/api/admin/bookings/${reference}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus, paymentStatus: nextPayment, note }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Could not update this booking.');
        return;
      }

      setNote('');
      setSaved(true);
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-5">
      <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
        Manage booking
      </h2>
      <p className="mt-1 text-[12.5px] leading-relaxed text-mute">
        Changes are logged against the booking. Marking a payment paid does not move real money.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
          Booking status
          <select
            value={nextStatus}
            onChange={(event) => setNextStatus(event.target.value as BookingStatus)}
            className={selectClass}
          >
            {STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55">
          Payment status
          <select
            value={nextPayment}
            onChange={(event) => setNextPayment(event.target.value as BookingPaymentStatus)}
            className={selectClass}
          >
            {PAYMENT_STATUSES.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55 sm:col-span-2">
          Internal note (optional)
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={2}
            maxLength={500}
            placeholder="Why this change was made…"
            className="mt-1.5 w-full resize-y rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5"
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-clay">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
      {saved ? (
        <p className="mt-3 flex items-center gap-1.5 text-[12px] text-forest">
          <Check className="h-3.5 w-3.5" />
          Booking updated.
        </p>
      ) : null}

      <button type="submit" disabled={busy} className="btn-primary mt-4 w-full">
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving
          </>
        ) : (
          'Save changes'
        )}
      </button>
    </form>
  );
}
