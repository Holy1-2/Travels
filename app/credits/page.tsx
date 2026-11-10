import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import creditsData from '../../assets-src/credits.json';

type Credit = { file: string; title: string; source: string };

const credits = creditsData as Credit[];

const groups: { key: string; title: string; note: string }[] = [
  { key: '/images/hero/', title: 'Hero images', note: 'The first landscapes you see.' },
  { key: '/images/destinations/', title: 'Destinations', note: 'One photograph for each region.' },
  { key: '/images/stays/', title: 'Stays', note: 'Property and surrounding scenery.' },
  { key: '/images/experiences/', title: 'Experiences', note: 'The mornings and afternoons you can book.' },
];

export const metadata: Metadata = {
  title: 'Photography credits',
  description:
    'Photography credits and original sources for the images used across Hamubere Travels.',
};

export default function CreditsPage() {
  return (
    <div className="wrap py-12 lg:py-16">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>

      <div className="mt-6 max-w-2xl">
        <p className="eyebrow">Credits</p>
        <h1 className="mt-3 font-display text-[clamp(32px,4.6vw,48px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
          Photographs, <span className="text-forest">properly credited.</span>
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-mute">
          The photography on this site comes from open-licence collections and generous
          photographers. Each image links back to its original source. If you are the owner of an
          image and would like it removed or credited differently, write to us and we will fix it
          quickly.
        </p>
      </div>

      <div className="mt-12 space-y-14">
        {groups.map((group) => {
          const items = credits.filter((credit) => credit.file.startsWith(group.key));
          if (!items.length) return null;

          return (
            <section key={group.key}>
              <div className="flex flex-wrap items-end justify-between gap-2 border-b border-line pb-4">
                <h2 className="font-display text-[22px] font-semibold tracking-[-0.025em] text-ink">
                  {group.title}
                </h2>
                <p className="text-[13px] text-mute">
                  {group.note} · {items.length} images
                </p>
              </div>

              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((credit) => (
                  <li key={credit.file}>
                    <a
                      href={credit.source}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group flex items-center gap-3 rounded-xl border border-line bg-white p-2.5 transition hover:border-ink/20 hover:bg-soft/60"
                    >
                      <span className="relative h-14 w-16 shrink-0 overflow-hidden rounded-lg bg-mist">
                        <Image
                          src={credit.file}
                          alt=""
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-[12.5px] font-medium leading-snug text-ink">
                          {credit.title}
                        </span>
                        <span className="mt-0.5 block truncate text-[11px] text-mute">
                          {credit.file.replace('/images/', '')}
                        </span>
                      </span>
                      <ExternalLink className="h-3.5 w-3.5 shrink-0 text-mute transition group-hover:text-forest" />
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <div className="mt-14 rounded-2xl border border-line bg-soft p-6 sm:p-8">
        <p className="text-[14px] leading-relaxed text-mute">
          Most images are sourced from Wikimedia Commons and Pexels under their respective open
          licences. The site design, copy and code are original to Hamubere Travels.
        </p>
        <a
          href="mailto:hello@hamubere.com"
          className="mt-3 inline-flex items-center gap-2 text-[14px] font-semibold text-forest underline decoration-forest/30 decoration-2 underline-offset-4"
        >
          hello@hamubere.com
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </div>
  );
}
