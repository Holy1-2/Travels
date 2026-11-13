'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowRight, Loader2, Search } from 'lucide-react';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5';

export default function BookingLookupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData(event.currentTarget);
    const reference = String(data.get('reference') ?? '').trim().toUpperCase();
    const email = String(data.get('email') ?? '').trim();

    try {
      const params = new URLSearchParams({ reference, email });
      const response = await fetch(`/api/bookings/lookup?${params.toString()}`, {
        cache: 'no-store',
      });
      const payload = await response.json();

      if (!response.ok || !payload.booking) {
        setError(payload.error || 'No booking matches those details.');
        return;
      }

      router.push(`/bookings/${payload.booking.reference}`);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-7">
      <h2 className="font-display text-[21px] font-semibold tracking-[-0.025em] text-ink">
        Find your booking
      </h2>
      <p className="mt-1 text-[13.5px] leading-relaxed text-mute">
        Use the reference from your confirmation email and the email you booked with.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[12.5px] font-medium text-ink">
          Booking reference
          <input
            name="reference"
            required
            placeholder="HAM-XXXXXX"
            autoComplete="off"
            className={`${inputClass} font-semibold uppercase tracking-wide`}
          />
        </label>
        <label className="block text-[12.5px] font-medium text-ink">
          Email
          <input
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            autoComplete="email"
            className={inputClass}
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 flex items-start gap-2 text-[12.5px] leading-relaxed text-clay">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full sm:w-auto">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Looking up
          </>
        ) : (
          <>
            <Search className="h-4 w-4" />
            Find booking
          </>
        )}
      </button>

      <p className="mt-4 flex items-center gap-1.5 text-[12px] text-mute">
        <ArrowRight className="h-3.5 w-3.5" />
        Your reference starts with HAM- and has six more characters.
      </p>
    </form>
  );
}
