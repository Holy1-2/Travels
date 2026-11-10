import Link from 'next/link';
import { ArrowUp, Mail, MapPin, Phone } from 'lucide-react';
import Logo from './Logo';
import { regions, site } from '@/lib/data';

const explore = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/stays', label: 'Stays' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/favorites', label: 'Saved stays' },
];

const company = [
  { href: '/about', label: 'About Hamubere' },
  { href: '/list-property', label: 'List your property' },
  { href: '/credits', label: 'Photography credits' },
];

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-line bg-soft text-ink">
      <div className="wrap py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-mute">
              Handpicked stays and experiences across the land of a thousand hills. Travel that
              feels local, from the Virunga volcanoes to Lake Kivu.
            </p>
            <p className="mt-4 text-[13.5px] font-medium text-forest">
              {site.greeting} — welcome to Rwanda.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {['MTN MoMo', 'Airtel Money', 'Visa', 'Mastercard'].map((method) => (
                <span
                  key={method}
                  className="rounded-full border border-line bg-white px-3 py-1.5 text-[11px] font-medium text-mute"
                >
                  {method}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute/70">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {explore.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-mute transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute/70">
              Regions
            </h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {regions.map((region) => (
                <li key={region.slug}>
                  <Link
                    href={`/destinations/${region.slug}`}
                    className="text-mute transition hover:text-ink"
                  >
                    {region.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-[0.18em] text-mute/70">
              Contact
            </h3>
            <ul className="mt-4 space-y-2.5 text-[14px]">
              {company.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-mute transition hover:text-ink">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2.5 text-[13.5px] text-mute">
              <a
                href={`mailto:${site.email}`}
                className="flex items-center gap-2.5 transition hover:text-ink"
              >
                <Mail className="h-4 w-4 text-forest" />
                {site.email}
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin className="h-4 w-4 text-forest" />
                {site.location}
              </div>
              <a
                href={`tel:${site.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-2.5 transition hover:text-ink"
              >
                <Phone className="h-4 w-4 text-forest" />
                {site.phone}
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-line pt-6 text-[13px] text-mute sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Hamubere Travels · Made in Rwanda</p>
          <div className="flex flex-wrap items-center gap-5">
            <Link href="/credits" className="transition hover:text-ink">
              Photo credits
            </Link>
            <Link href="/list-property" className="transition hover:text-ink">
              Host with us
            </Link>
            <a href="#main" className="inline-flex items-center gap-1.5 transition hover:text-ink">
              Back to top
              <ArrowUp className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
