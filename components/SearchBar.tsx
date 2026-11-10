'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowRight, CalendarDays, ChevronDown, MapPin, Users } from 'lucide-react';
import { regions } from '@/lib/data';
import { addDays, todayISO } from '@/lib/utils';

export default function SearchBar({ variant = 'page' }: { variant?: 'page' | 'hero' }) {
  const router = useRouter();
  const today = todayISO();
  const [region, setRegion] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState('2');
  const [error, setError] = useState('');

  const handleCheckIn = (value: string) => {
    setCheckIn(value);
    if (value && (!checkOut || checkOut <= value)) {
      setCheckOut(addDays(value, 2));
    }
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();

    if (checkIn && !checkOut) {
      setError('Add a check-out date so we can show nightly totals.');
      return;
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }

    setError('');
    const params = new URLSearchParams();
    if (region) params.set('region', region);
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    if (guests) params.set('guests', guests);

    router.push('/stays' + (params.toString() ? `?${params.toString()}` : ''));
  };

  const fieldClass =
    'flex items-center gap-2.5 rounded-xl px-4 py-2.5 transition duration-200 hover:bg-soft md:rounded-full';
  const valueClass =
    'w-full appearance-none border-0 bg-transparent p-0 text-[14px] font-medium text-ink outline-none';

  return (
    <form
      onSubmit={submit}
      role="search"
      aria-label="Find a stay in Rwanda"
      className={`relative grid gap-1 rounded-2xl border border-line bg-white p-2 shadow-search md:grid-cols-[1.35fr_1fr_1fr_0.8fr_auto] md:gap-0 md:rounded-full ${
        variant === 'hero' ? '' : 'md:rounded-full'
      }`}
    >
      <div className={`${fieldClass} md:rounded-l-full`}>
        <MapPin className="h-[18px] w-[18px] shrink-0 text-forest" strokeWidth={1.8} />
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Where
          </span>
          <div className="relative">
            <select
              aria-label="Region"
              value={region}
              onChange={(event) => setRegion(event.target.value)}
              className={`${valueClass} cursor-pointer pr-5`}
            >
              <option value="">Anywhere in Rwanda</option>
              {regions.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mute" />
          </div>
        </div>
      </div>

      <div className={`${fieldClass} md:border-l md:border-line`}>
        <CalendarDays className="h-[18px] w-[18px] shrink-0 text-forest" strokeWidth={1.8} />
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Check in
          </span>
          <input
            type="date"
            aria-label="Check-in date"
            min={today}
            value={checkIn}
            onChange={(event) => handleCheckIn(event.target.value)}
            className={valueClass}
          />
        </div>
      </div>

      <div className={`${fieldClass} md:border-l md:border-line`}>
        <CalendarDays className="h-[18px] w-[18px] shrink-0 text-forest" strokeWidth={1.8} />
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Check out
          </span>
          <input
            type="date"
            aria-label="Check-out date"
            min={checkIn ? addDays(checkIn, 1) : today}
            value={checkOut}
            onChange={(event) => setCheckOut(event.target.value)}
            className={valueClass}
          />
        </div>
      </div>

      <div className={`${fieldClass} md:border-l md:border-line`}>
        <Users className="h-[18px] w-[18px] shrink-0 text-forest" strokeWidth={1.8} />
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-semibold uppercase tracking-[0.14em] text-mute">
            Guests
          </span>
          <div className="relative">
            <select
              aria-label="Guests"
              value={guests}
              onChange={(event) => setGuests(event.target.value)}
              className={`${valueClass} cursor-pointer pr-5`}
            >
              {[1, 2, 3, 4, 5, 6].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? 'guest' : 'guests'}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-0 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-mute" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary min-h-[52px] rounded-xl px-6 md:rounded-full"
      >
        Search
        <ArrowRight className="h-4 w-4" />
      </button>

      {error ? (
        <p className="col-span-full px-4 pb-1 text-[13px] font-medium text-clay" role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
