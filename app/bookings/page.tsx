import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, CalendarDays, LifeBuoy, Mail, Search, ShieldCheck } from 'lucide-react';
import BookingLookupForm from '@/components/BookingLookupForm';

export const metadata: Metadata = {
  title: 'Find your booking',
  description:
    'Look up a Hamubere Travels booking with your reference and email, check the payment status and manage your trip.',
};

export default function BookingsPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <div className="mx-auto max-w-4xl">
        <div className="max-w-2xl">
          <p className="eyebrow">Manage your trip</p>
          <h1 className="mt-3 font-display text-[clamp(32px,4.6vw,48px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
            Find your <span className="text-forest">booking.</span>
          </h1>
          <p className="mt-3 text-[15px] leading-relaxed text-mute">
            Check your payment status, print your confirmation, or pick up where you left off. Your
            reference is in the confirmation email we sent.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <BookingLookupForm />

          <div className="rounded-2xl border border-line bg-soft/70 p-6">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
              What you can do here
            </p>
            <ul className="mt-4 space-y-4">
              {[
                {
                  icon: ShieldCheck,
                  title: 'Check a payment',
                  copy: 'See whether a MoMo, Airtel or card payment has cleared.',
                },
                {
                  icon: CalendarDays,
                  title: 'Review the details',
                  copy: 'Dates, guests, host notes and the price breakdown in one place.',
                },
                {
                  icon: ArrowRight,
                  title: 'Complete an unpaid booking',
                  copy: 'Resume checkout while your held dates are still available.',
                },
              ].map((entry) => {
                const Icon = entry.icon;
                return (
                  <li key={entry.title} className="flex gap-3">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white text-forest">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-ink">{entry.title}</p>
                      <p className="mt-0.5 text-[12.5px] leading-relaxed text-mute">{entry.copy}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-line px-6 py-5 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <LifeBuoy className="mt-0.5 h-5 w-5 shrink-0 text-forest" strokeWidth={1.7} />
            <div>
              <p className="text-[13.5px] font-semibold text-ink">Lost your reference?</p>
              <p className="mt-0.5 text-[12.5px] text-mute">
                Send us the email you booked with and we will find it.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="mailto:hello@hamubere.com" className="btn-outline">
              <Mail className="h-4 w-4" />
              Email us
            </a>
            <Link href="/stays" className="btn-primary">
              <Search className="h-4 w-4" />
              Browse stays
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
