import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Clock3 } from 'lucide-react';
import { regionMap, type Experience } from '@/lib/data';
import { rwf } from '@/lib/utils';

export default function ExperienceCard({
  experience,
  eager = false,
}: {
  experience: Experience;
  eager?: boolean;
}) {
  const region = regionMap[experience.region];

  return (
    <Link href={`/experiences/${experience.slug}`} className="group flex h-full flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-mist">
        <Image
          src={experience.image}
          alt={experience.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          loading={eager ? 'eager' : 'lazy'}
          quality={80}
          className="object-cover transition duration-700 ease-smooth group-hover:scale-[1.04]"
        />
        <span className="tag-pill absolute left-3 top-3">
          <Clock3 className="h-3.5 w-3.5 text-forest" />
          {experience.duration}
        </span>
      </div>

      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-mute">
          {region.name}
        </p>
        <h3 className="mt-1 text-[16px] font-semibold leading-snug text-ink transition group-hover:text-forest">
          {experience.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-mute">
          {experience.summary}
        </p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-4">
          <p className="text-[13.5px] text-mute">
            <strong className="font-semibold text-ink">{rwf(experience.price)}</strong>
            <span className="block text-[11.5px]">per person · {experience.groupSize}</span>
          </p>
          <span className="grid h-8 w-8 place-items-center rounded-full border border-line text-ink transition duration-300 group-hover:border-ink/25 group-hover:bg-soft">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
