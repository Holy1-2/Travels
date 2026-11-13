import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  HeartHandshake,
  Leaf,
  MapPin,
  Sparkles,
} from 'lucide-react';
import Reveal from '@/components/Reveal';
import SectionHeader from '@/components/SectionHeader';

export const metadata: Metadata = {
  title: 'About',
  description:
    'Hamubere Travels is a small Kigali-based team curating handpicked stays and local experiences across Rwanda.',
};

const values = [
  {
    icon: MapPin,
    title: 'Local, by design',
    copy: 'We live here. Every recommendation comes from a place we have slept in, eaten at or walked ourselves.',
  },
  {
    icon: HeartHandshake,
    title: 'Fair by default',
    copy: 'Guides and hosts set their own rates. We keep our fee small and transparent, and pay people on time.',
  },
  {
    icon: Leaf,
    title: 'Travel that gives back',
    copy: 'A share of every booking goes to conservation and park-edge community projects across Rwanda.',
  },
];

const steps = [
  {
    title: 'Tell us the shape of your trip',
    copy: 'Dates, pace, who is travelling and what you actually want to see. A short message is enough.',
  },
  {
    title: 'We match the places',
    copy: 'A real person on our team suggests stays and experiences, with honest notes on each.',
  },
  {
    title: 'Book and pay online',
    copy: 'Choose your dates, reserve instantly and pay securely with MTN MoMo, Airtel Money, Visa or Mastercard.',
  },
];

const team = [
  { name: 'Aline Uwase', role: 'Stays & partnerships', place: 'Kigali' },
  { name: 'Eric Ndayisaba', role: 'Guides & experiences', place: 'Musanze' },
  { name: 'Claudine Mukamana', role: 'Guest care', place: 'Rubavu' },
];

export default function AboutPage() {
  return (
    <div>
      <section className="border-b border-line bg-hero-wash">
        <div className="wrap py-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-16">
            <div>
              <p className="eyebrow">Murakaza neza</p>
              <h1 className="mt-4 max-w-[15ch] text-balance font-display text-[clamp(36px,5.4vw,58px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
                A small team, <span className="text-forest">a whole country.</span>
              </h1>
              <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-mute">
                Hamubere means “welcome” in Kinyarwanda. We started this platform because booking a
                Rwandan stay should feel personal — not like scrolling through a warehouse of
                listings.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link href="/stays" className="btn-primary">
                  Find your stay
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/list-property" className="btn-outline">
                  Host with us
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
              <Image
                src="/images/hero/hero-tea.jpg"
                alt="Tea pickers on the hills of western Rwanda"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={82}
                className="object-cover"
              />
            </div>
          </div>

          <dl className="mt-10 grid gap-6 border-t border-line pt-7 sm:grid-cols-4">
            {[
              { value: '12', label: 'handpicked stays' },
              { value: '10', label: 'local experiences' },
              { value: '46', label: 'local partners' },
              { value: '1,400+', label: 'travellers hosted' },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="sr-only">{stat.label}</dt>
                <dd>
                  <span className="font-display text-[26px] font-semibold leading-none tracking-[-0.02em] text-ink">
                    {stat.value}
                  </span>
                  <span className="mt-1.5 block text-[10.5px] font-semibold uppercase tracking-[0.12em] text-mute">
                    {stat.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap mt-16 lg:mt-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow">Our story</p>
              <h2 className="mt-3 font-display text-[clamp(26px,3vw,34px)] font-semibold leading-[1.12] tracking-[-0.03em] text-ink">
                Built in Kigali, one visit at a time.
              </h2>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="prose-copy">
              <p>
                We began with a notebook of places we loved: a guesthouse behind a green gate in
                Kiyovu, a lodge above the Virunga foothills, a camp where the forest sounds pass
                under the bed. Friends kept asking for the list, so we made it a website.
              </p>
              <p>
                Today the team is still small. We visit every property, re-check the details twice a
                year, and keep the collection deliberately short. If a place is not ready for
                guests, it does not go live.
              </p>
              <p>
                The name Hamubere is what you say when someone arrives. That is the whole idea: a
                warm, straightforward welcome, followed by a trip that feels like it belongs to the
                place.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="What we stand for"
            title={
              <>
                Three things we <span className="text-forest">do not compromise.</span>
              </>
            }
          />
        </Reveal>
        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {values.map((value, index) => {
            const Icon = value.icon;
            return (
              <Reveal key={value.title} delay={Math.min(index * 0.07, 0.2)}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-soft text-forest">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.7} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{value.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{value.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <div className="overflow-hidden rounded-2xl border border-line bg-soft/70 p-6 sm:p-8 lg:p-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">How it works</p>
              <h2 className="mt-3 font-display text-[clamp(24px,2.8vw,32px)] font-semibold leading-[1.1] tracking-[-0.03em] text-ink">
                A real person, start to finish.
              </h2>
            </div>
            <Link href="/stays" className="btn-outline">
              Start with a stay
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl bg-white p-5">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-soft text-[13px] font-semibold text-forest">
                  {index + 1}
                </span>
                <h3 className="mt-3 text-[14px] font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-[13px] leading-relaxed text-mute">{step.copy}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-24">
        <Reveal>
          <SectionHeader
            eyebrow="The team"
            title={
              <>
                People you will <span className="text-forest">actually meet.</span>
              </>
            }
            subtitle="A few of the faces behind the inbox. Everyone here lives and travels in Rwanda."
          />
        </Reveal>

        <div className="mt-9 grid gap-4 sm:grid-cols-3">
          {team.map((person, index) => (
            <Reveal key={person.name} delay={Math.min(index * 0.07, 0.2)}>
              <div className="rounded-2xl border border-line bg-white p-6">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-forest font-display text-[18px] font-semibold text-white">
                  {person.name
                    .split(' ')
                    .map((part) => part[0])
                    .join('')}
                </span>
                <h3 className="mt-4 text-[15px] font-semibold text-ink">{person.name}</h3>
                <p className="mt-0.5 text-[13px] text-mute">{person.role}</p>
                <p className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] font-medium text-forest">
                  <MapPin className="h-3.5 w-3.5" strokeWidth={1.8} />
                  {person.place}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-16 lg:mt-20">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl bg-forest px-6 py-12 text-center text-white sm:px-12 sm:py-14">
            <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full bg-white/5" />
            <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-white/5" />
            <div className="relative mx-auto max-w-xl">
              <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white/10">
                <Sparkles className="h-5 w-5 text-white/80" strokeWidth={1.7} />
              </span>
              <h2 className="mt-5 font-display text-[28px] font-semibold leading-[1.1] tracking-[-0.03em] text-white sm:text-[36px]">
                One good night&apos;s sleep is where Rwanda begins.
              </h2>
              <p className="mx-auto mt-3 max-w-md text-[14.5px] leading-relaxed text-white/65">
                Tell us when you are coming. We will reply with a short list of places that fit.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/stays" className="btn-gold">
                  Find your stay
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/experiences"
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-[14px] font-semibold text-white transition hover:bg-white/10"
                >
                  See experiences
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
