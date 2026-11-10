import Image from 'next/image';
import Link from 'next/link';
import type { Region } from '@/lib/data';

export default function DestinationCard({
  region,
  stayCount,
  eager = false,
}: {
  region: Region;
  stayCount: number;
  eager?: boolean;
}) {
  return (
    <Link
      href={`/destinations/${region.slug}`}
      className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-mist"
    >
      <Image
        src={region.image}
        alt={`${region.name} — ${region.tagline}`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        loading={eager ? 'eager' : 'lazy'}
        quality={80}
        className="object-cover transition duration-700 ease-smooth group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1.5 text-[11px] font-semibold text-ink backdrop-blur-sm">
        {stayCount} {stayCount === 1 ? 'stay' : 'stays'}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 text-white">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/65">
          {region.place}
        </p>
        <h3 className="mt-1 font-display text-[22px] font-semibold leading-tight tracking-[-0.02em] text-white">
          {region.name}
        </h3>
        <p className="mt-0.5 text-[13px] leading-snug text-white/70">{region.tagline}</p>
      </div>
    </Link>
  );
}
