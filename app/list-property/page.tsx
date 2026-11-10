import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CreditCard,
  HandCoins,
  MapPin,
  Users,
} from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import Reveal from '@/components/Reveal';

export const metadata: Metadata = {
  title: 'List your property',
  description:
    'List your hotel, lodge, camp, villa or guesthouse with Hamubere Travels and reach guests from Kigali to Kinshasa. No listing fee.',
};

const benefits = [
  {
    icon: Users,
    title: 'Guests who fit',
    copy: 'We match your rooms with travellers who are looking for exactly what you offer.',
  },
  {
    icon: HandCoins,
    title: 'No listing fee',
    copy: 'You keep your rate. We only take a small service fee when a booking is confirmed.',
  },
  {
    icon: CreditCard,
    title: 'Local payments',
    copy: 'MoMo, Airtel Money, Visa and Mastercard — settled directly with you.',
  },
  {
    icon: CalendarDays,
    title: 'Simple calendar',
    copy: 'Send availability by WhatsApp or email. No new software to learn.',
  },
];

const steps = [
  {
    title: 'Send the basics',
    copy: 'Fill in the form with your property details, rooms and location.',
  },
  {
    title: 'We visit',
    copy: 'Our Kigali team comes to see the property and takes a few honest photos.',
  },
  {
    title: 'Go live',
    copy: 'We write the listing with you, set your rates and start sending requests.',
  },
];

export default function ListPropertyPage() {
  return (
    <div>
      <section className="border-b border-line bg-hero-wash">
        <div className="wrap py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end lg:gap-16">
            <div>
              <p className="eyebrow">Host with Hamubere</p>
              <h1 className="mt-4 max-w-[16ch] text-balance font-display text-[clamp(36px,5.4vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
                Your place, <span className="text-forest">the right guests.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-mute">
                We work with a small number of hotels, lodges, camps, villas and guesthouses across
                Rwanda. If you host with care, we would like to meet you.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {['No listing fee', 'Visited by our team', 'Paid in RWF', 'Reply in 1 day'].map(
                  (item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink"
                    >
                      <BadgeCheck className="h-3.5 w-3.5 text-forest" strokeWidth={1.8} />
                      {item}
                    </span>
                  )
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-line bg-white p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute">
                Already a partner?
              </p>
              <p className="mt-2 text-[15px] font-medium leading-relaxed text-ink">
                Message the team directly for availability changes, rate updates or guest requests.
              </p>
              <a
                href="mailto:hello@hamubere.com"
                className="mt-4 inline-flex items-center gap-2 text-[14px] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4"
              >
                hello@hamubere.com
                <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap mt-14">
        <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <Reveal>
              <h2 className="font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
                Why hosts work with us
              </h2>
              <div className="mt-6 space-y-5">
                {benefits.map((benefit) => {
                  const Icon = benefit.icon;
                  return (
                    <div key={benefit.title} className="flex gap-3.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft text-forest">
                        <Icon className="h-4 w-4" strokeWidth={1.8} />
                      </span>
                      <div>
                        <h3 className="text-[14px] font-semibold text-ink">{benefit.title}</h3>
                        <p className="mt-1 max-w-sm text-[13.5px] leading-relaxed text-mute">
                          {benefit.copy}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Reveal>

            <Reveal delay={0.06}>
              <div className="mt-8 rounded-2xl bg-forest p-6 text-white">
                <MapPin className="h-5 w-5 text-white/70" strokeWidth={1.7} />
                <p className="mt-3 font-display text-[18px] font-semibold leading-snug tracking-[-0.02em]">
                  We visit every property in person.
                </p>
                <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">
                  Our team is based in Kigali and travels across all six regions. Expect an honest
                  conversation, not a sales pitch.
                </p>
              </div>
            </Reveal>
          </div>

          <div>
            <Reveal>
              <PropertyForm />
            </Reveal>
          </div>
        </div>
      </section>

      <section className="wrap mt-16">
        <Reveal>
          <div className="rounded-2xl border border-line bg-soft/70 p-6 sm:p-8">
            <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
              How listing works
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {steps.map((step, index) => (
                <div key={step.title}>
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[13px] font-semibold text-forest">
                    {index + 1}
                  </span>
                  <h3 className="mt-3 text-[14px] font-semibold text-ink">{step.title}</h3>
                  <p className="mt-1 text-[13px] leading-relaxed text-mute">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-12">
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-line px-6 py-6 sm:flex-row sm:items-center">
            <p className="text-[14px] text-mute">
              Not ready to list yet? Explore the collection first.
            </p>
            <Link href="/stays" className="btn-outline shrink-0">
              See the stays
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
