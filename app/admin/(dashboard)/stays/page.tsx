import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { BedDouble, Pencil, Plus } from 'lucide-react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import DeleteButton from '@/components/admin/DeleteButton';
import { getStays } from '@/lib/server/content';
import { regionMap } from '@/lib/data';
import { rwf } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin stays',
  robots: { index: false, follow: false },
};

export default async function AdminStaysPage() {
  const stays = getStays();

  return (
    <div className="space-y-5">
      <AdminPageHeader
        eyebrow="Content"
        title="Stays"
        description="Hotels, lodges, camps, villas and guesthouses shown on the public site."
        action={
          <Link href="/admin/stays/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            Add stay
          </Link>
        }
      />

      {stays.length ? (
        <div className="grid gap-3">
          {stays.map((stay) => (
            <article
              key={stay.slug}
              className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-4 sm:flex-row sm:items-center"
            >
              <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-mist sm:aspect-[4/3] sm:w-32">
                {stay.images[0] ? (
                  <Image
                    src={stay.images[0]}
                    alt={stay.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid h-full place-items-center text-mute">
                    <BedDouble className="h-6 w-6" />
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
                    {stay.name}
                  </h2>
                  {stay.badge ? (
                    <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-clay">
                      {stay.badge}
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 text-[12px] text-mute">
                  {stay.type} · {regionMap[stay.region]?.name ?? stay.region} · {stay.location}
                </p>
                <p className="mt-1.5 text-[12.5px] text-ink">
                  {rwf(stay.price)} <span className="text-mute">/ night</span>
                  <span className="text-mute"> · sleeps {stay.capacity}</span>
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <Link
                  href={`/admin/stays/${stay.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line px-3.5 py-2 text-[12px] font-semibold text-ink transition hover:bg-soft"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <DeleteButton
                  url={`/api/admin/stays/${encodeURIComponent(stay.slug)}`}
                  confirmMessage={`Delete “${stay.name}”? This cannot be undone.`}
                />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <BedDouble className="mx-auto h-8 w-8 text-mute/60" strokeWidth={1.5} />
          <p className="mt-3 text-[14px] font-medium text-ink">No stays yet</p>
          <p className="mt-1 text-[12.5px] text-mute">
            Add your first stay, or restore the demo content from the overview page.
          </p>
          <Link href="/admin/stays/new" className="btn-primary mt-4">
            <Plus className="h-4 w-4" />
            Add stay
          </Link>
        </div>
      )}
    </div>
  );
}
