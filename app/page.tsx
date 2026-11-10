import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CreditCard,
  MapPin,
  ShieldCheck,
  Star,
  Users,
} from 'lucide-react';
import SearchBar from '@/components/SearchBar';
import SectionHeader from '@/components/SectionHeader';
import DestinationCard from '@/components/DestinationCard';
import StayCard from '@/components/StayCard';
import ExperienceCard from '@/components/ExperienceCard';
import VideoSection from '@/components/VideoSection';
import Reveal from '@/components/Reveal';
import { experiences, regions, stays, staysInRegion } from '@/lib/data';

export const metadata: Metadata = {
  description:
    'Handpicked hotels, lodges, camps and villas across Rwanda. Book gorilla trekking, Lake Kivu sunsets, Nyungwe canopy walks and Akagera safaris with local hosts.',
};

const featuredStays = stays.slice(0, 8);
const previewExperiences = [
  experiences.find((item) => item.slug === 'gorilla-trekking')!,
  experiences.find((item) => item.slug === 'kivu-boat-cruise')!,
  experiences.find((item) => item.slug === 'nyungwe-canopy-walk')!,
];

const promises = [
  {
    icon: MapPin,
    title: 'Hosts we actually know',
    copy: 'Every lodge, camp and villa is visited and vetted by our small team in Kigali — no stock listings.',
  },
  {
    icon: CreditCard,
    title: 'Pay the Rwandan way',
    copy: 'Prices in RWF. Pay with MTN MoMo, Airtel Money, Visa or Mastercard once your host confirms.',
  },
  {
    icon: Users,
    title: 'Guides, not middlemen',
    copy: 'Experiences are run by licensed Rwandan guides and cooperatives, at fair local rates.',
  },
  {
    icon: ShieldCheck,
    title: 'Travel that gives back',
    copy: 'A share of every booking supports conservation and park-edge community projects.',
  },
];

export default function HomePage() {
  return (
    <div>
      <section className="grain relative overflow-hidden bg-hero-wash">
        <div className="wrap grid gap-12 pb-16 pt-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:gap-16 lg:pb-24 lg:pt-16">
          <div>
            <p className="eyebrow">Murakaza neza · Welcome to Rwanda</p>
            <h1 className="mt-5 max-w-[15ch] text-balance font-display text-[clamp(40px,5.6vw,64px)] font-semibold leading-[1.02] tracking-[-0.045em] text-ink">
              Stay well in the land of a{' '}
              <span className="text-forest">thousand hills.</span>
            </h1>
            <p className="mt-5 max-w-lg text-[15.5px] leading-relaxed text-mute">
              Sleep beside the Virunga volcanoes, swim off a Lake Kivu deck and wake inside the
              Nyungwe canopy. Handpicked stays and local experiences, booked in one calm place.
            </p>

            <div className="mt-7">
              <SearchBar variant="hero" />
            </div>

            <dl className="mt-9 grid max-w-xl grid-cols-2 gap-x-6 gap-y-5 border-t border-line pt-7 sm:grid-cols-4">
              {[
                { value: '12', label: 'handpicked stays' },
                { value: '6', label: 'regions' },
                { value: '4.8', label: 'guest rating' },
                { value: '10', label: 'experiences' },
              ].map((stat) => (
                <div key={stat.label}>
                  <dt className="sr-only">{stat.label}</dt>
                  <dd>
                    <span className="font-display text-[25px] font-semibold leading-none tracking-[-0.02em] text-ink">
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

          <div className="relative mx-auto w-full max-w-[520px] lg:max-w-none">
            <div className="relative ml-auto aspect-[4/5] w-[90%] overflow-hidden rounded-3xl bg-mist sm:w-[86%]">
              <Image
                src="/images/hero/hero-gorilla.jpg"
                alt="Mountain gorilla in the bamboo forest of Volcanoes National Park"
                fill
                priority
                sizes="(max-width: 1024px) 90vw, 46vw"
                quality={82}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
              <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
                <div className="rounded-xl border border-white/20 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                  <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-white/65">
                    Up close
                  </p>
                  <p className="mt-1 font-display text-[17px] font-semibold leading-tight text-white">
                    Volcanoes National Park
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-white/65">Musanze · Northern Province</p>
                </div>
                <Link
                  href="/destinations/volcanoes"
                  aria-label="Explore Volcanoes National Park"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink transition hover:bg-soft"
                >
                  <ArrowUpRight className="h-[18px] w-[18px]" />
                </Link>
              </div>
            </div>

            <div className="animate-float absolute -left-2 bottom-16 z-10 hidden w-[36%] overflow-hidden rounded-2xl border-4 border-white bg-mist shadow-lift sm:block lg:-left-5">
              <div className="relative aspect-[4/5]">
                <Image
                  src="/images/hero/hero-kivu.jpg"
                  alt="Sunset over Lake Kivu"
                  fill
                  sizes="20vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -right-1 top-5 z-10 hidden w-[32%] overflow-hidden rounded-2xl border-4 border-white bg-mist shadow-lift md:block">
              <div className="relative aspect-square">
                <Image
                  src="/images/hero/hero-tea.jpg"
                  alt="Tea pickers on a green hillside in Rwanda"
                  fill
                  sizes="18vw"
                  quality={80}
                  className="object-cover"
                />
              </div>
            </div>

            <div className="absolute -left-1 top-5 z-10 flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-2 shadow-soft sm:-left-2 lg:top-10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-fern" />
              </span>
              <span className="text-[11px] font-semibold text-ink">Hosts replying now</span>
              <span className="flex items-center gap-0.5 text-[11px] font-medium text-mute">
                <Star className="h-3 w-3 fill-ink text-ink" />
                4.8
              </span>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap pt-20 lg:pt-28">
        <Reveal>
          <SectionHeader
            eyebrow="Where to go"
            title={
              <>
                Six regions, <span className="text-forest">one small country.</span>
              </>
            }
            subtitle="From the gorillas of the north to the savannah in the east, each corner of Rwanda asks for a different kind of stay."
            action={
              <Link href="/destinations" className="btn-outline">
                All destinations
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region, index) => (
            <Reveal key={region.slug} delay={Math.min(index * 0.06, 0.3)}>
              <DestinationCard
                region={region}
                stayCount={staysInRegion(region.slug).length}
                eager={index < 3}
              />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mt-20 border-y border-line bg-soft py-20 lg:mt-28">
        <div className="wrap">
          <Reveal>
            <SectionHeader
              eyebrow="Places to wake up"
              title={
                <>
                  Rooms with a <span className="text-forest">point of view.</span>
                </>
              }
              subtitle="Eight of our twelve handpicked stays, from a 65,000 RWF garden guesthouse to a signature volcano retreat."
              action={
                <Link href="/stays" className="btn-primary">
                  Browse all stays
                  <ArrowRight className="h-4 w-4" />
                </Link>
              }
            />
          </Reveal>

          <div className="mt-10 grid grid-cols-1 gap-x-5 gap-y-9 sm:grid-cols-2 lg:grid-cols-4">
            {featuredStays.map((stay, index) => (
              <Reveal key={stay.slug} delay={Math.min((index % 4) * 0.06, 0.24)}>
                <StayCard stay={stay} eager={index < 4} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12 text-center">
            <p className="text-[13.5px] text-mute">
              Showing 8 of {stays.length} stays · prices per night in RWF
            </p>
            <Link
              href="/stays"
              className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-ink underline decoration-forest decoration-2 underline-offset-4 transition hover:text-forest"
            >
              See every stay and filter by region
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <VideoSection />
        </Reveal>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <SectionHeader
            eyebrow="Why Hamubere"
            title={
              <>
                Small team. <span className="text-forest">Real Rwanda.</span>
              </>
            }
            subtitle="Hamubere means “welcome” in Kinyarwanda. We built this platform to make booking a Rwandan stay feel personal again."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {promises.map((promise, index) => {
            const Icon = promise.icon;
            return (
              <Reveal key={promise.title} delay={Math.min(index * 0.07, 0.28)}>
                <div className="flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition duration-300 hover:border-ink/15 hover:shadow-soft">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-soft text-forest">
                    <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-semibold text-ink">{promise.title}</h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">{promise.copy}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <SectionHeader
            eyebrow="Things to do"
            title={
              <>
                Mornings you will <span className="text-forest">talk about.</span>
              </>
            }
            subtitle="Trek with gorillas, drift across Lake Kivu at golden hour, or cross the Nyungwe canopy. Ten experiences, all led by local guides."
            action={
              <Link href="/experiences" className="btn-outline">
                All experiences
                <ArrowRight className="h-4 w-4" />
              </Link>
            }
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {previewExperiences.map((experience, index) => (
            <Reveal key={experience.slug} delay={Math.min(index * 0.08, 0.24)}>
              <ExperienceCard experience={experience} eager={index === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <div className="grid overflow-hidden rounded-2xl bg-forest text-white lg:grid-cols-[0.92fr_1.08fr]">
            <div className="relative min-h-[280px] lg:min-h-[400px]">
              <Image
                src="/images/hero/hero-tea.jpg"
                alt="Tea pickers on the hills of western Rwanda"
                fill
                sizes="(max-width: 1024px) 100vw, 44vw"
                quality={80}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/50 via-transparent to-transparent lg:bg-gradient-to-r" />
              <span className="absolute left-4 top-4 rounded-full bg-black/25 px-3 py-1.5 text-[10.5px] font-medium text-white backdrop-blur-md">
                Gisovu, Western Province
              </span>
            </div>

            <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-14">
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.2em] text-white/55">
                Guest stories
              </p>
              <blockquote className="mt-4 text-balance font-display text-[24px] font-medium leading-[1.28] tracking-[-0.02em] text-white sm:text-[30px]">
                “We came for the gorillas and left talking about the people. Claudine packed
                breakfast at 4am, and our guide knew every bird by its call.”
              </blockquote>
              <div className="mt-7 flex items-center gap-3.5">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/10 font-display text-[15px] font-semibold text-white">
                  SM
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-white">Sarah &amp; Mark</p>
                  <p className="flex items-center gap-1.5 text-[12px] text-white/55">
                    <MapPin className="h-3.5 w-3.5" />
                    London · stayed at Volcano View Lodge
                  </p>
                </div>
              </div>
              <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[12px] text-white/55">
                <span>
                  <strong className="font-semibold text-white">4.8 / 5</strong> average guest rating
                </span>
                <span>
                  <strong className="font-semibold text-white">1,400+</strong> travellers hosted
                </span>
                <span>
                  <strong className="font-semibold text-white">46</strong> local partners
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="wrap mt-20 lg:mt-28">
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-soft px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="relative mx-auto max-w-2xl">
              <p className="eyebrow justify-center">Your move</p>
              <h2 className="mt-4 text-balance font-display text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-ink sm:text-[40px]">
                One good night&apos;s sleep is where{' '}
                <span className="text-forest">Rwanda begins.</span>
              </h2>
              <p className="mx-auto mt-3.5 max-w-lg text-[15px] leading-relaxed text-mute">
                Tell us when you are coming and we will match you with the right hillside, lake
                shore or forest camp. No payment until a host confirms.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <Link href="/stays" className="btn-primary">
                  Find your stay
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/list-property" className="btn-outline">
                  Host with Hamubere
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
