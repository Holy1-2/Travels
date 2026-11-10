import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star } from 'lucide-react';
import FavoriteButton from './FavoriteButton';
import { regionMap, type Stay } from '@/lib/data';
import { rwf } from '@/lib/utils';

const TYPE_LABEL: Record<Stay['type'], string> = {
  Hotels: 'Hotel',
  Lodges: 'Lodge',
  Camps: 'Camp',
  Villas: 'Villa',
  Guesthouses: 'Guesthouse',
};

export default function StayCard({
  stay,
  query,
  eager = false,
}: {
  stay: Stay;
  query?: string;
  eager?: boolean;
}) {
  const href = `/stays/${stay.slug}${query ? `?${query}` : ''}`;
  const region = regionMap[stay.region];

  return (
    <article className="group relative">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-mist">
        <Link href={href} className="absolute inset-0 block" aria-label={`View ${stay.name}`}>
          <Image
            src={stay.images[0]}
            alt={`${stay.name} — ${stay.location}`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            loading={eager ? 'eager' : 'lazy'}
            quality={80}
            className="object-cover transition duration-700 ease-smooth group-hover:scale-[1.04]"
          />
        </Link>

        <span className="tag-pill pointer-events-none absolute left-3 top-3 z-10">
          {stay.badge ?? TYPE_LABEL[stay.type]}
        </span>

        <FavoriteButton
          slug={stay.slug}
          name={stay.name}
          className="absolute right-3 top-3 z-20"
        />
      </div>

      <Link href={href} className="block pt-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 text-[15px] font-semibold text-ink transition group-hover:text-forest">
            {stay.name}
          </h3>
          <span className="flex shrink-0 items-center gap-1 text-[13px] font-medium text-ink">
            <Star className="h-3.5 w-3.5 fill-ink text-ink" />
            {stay.rating.toFixed(1)}
          </span>
        </div>
        <p className="mt-0.5 flex items-center gap-1 text-[13.5px] text-mute">
          {region.name}
          <span className="text-line">·</span>
          <MapPin className="h-3 w-3 shrink-0" />
          {stay.location}
        </p>
        <p className="mt-1.5 text-[14px] text-mute">
          <strong className="font-semibold text-ink">{rwf(stay.price)}</strong> / night
        </p>
      </Link>
    </article>
  );
}
