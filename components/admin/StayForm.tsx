'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import { regions, STAY_TYPES, type Stay } from '@/lib/data';

const input =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-3.5 py-2.5 text-[13.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5';
const label = 'block text-[11px] font-semibold uppercase tracking-[0.12em] text-ink/55';
const hint = 'mt-1 text-[11px] font-normal normal-case tracking-normal text-mute';

function lines(value: FormDataEntryValue | null) {
  return String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

export default function StayForm({ stay }: { stay?: Stay }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [details, setDetails] = useState<string[]>([]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setDetails([]);

    const data = new FormData(event.currentTarget);
    const nearby = lines(data.get('nearby')).map((line) => {
      const [name, distance] = line.split('|').map((part) => part.trim());
      return { name: name ?? '', distance: distance ?? '' };
    });

    const payload = {
      slug: String(data.get('slug') ?? '').trim(),
      name: String(data.get('name') ?? '').trim(),
      type: String(data.get('type') ?? ''),
      region: String(data.get('region') ?? ''),
      location: String(data.get('location') ?? '').trim(),
      price: Number(data.get('price') ?? 0),
      rating: Number(data.get('rating') ?? 0),
      reviews: Number(data.get('reviews') ?? 0),
      capacity: Number(data.get('capacity') ?? 1),
      beds: String(data.get('beds') ?? '').trim(),
      images: lines(data.get('images')),
      tagline: String(data.get('tagline') ?? '').trim(),
      description: lines(data.get('description')),
      amenities: lines(data.get('amenities')),
      nearby,
      host: String(data.get('host') ?? '').trim(),
      hostNote: String(data.get('hostNote') ?? '').trim(),
      badge: String(data.get('badge') ?? '').trim() || null,
    };

    const endpoint = stay ? `/api/admin/stays/${encodeURIComponent(stay.slug)}` : '/api/admin/stays';

    try {
      const response = await fetch(endpoint, {
        method: stay ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Check the fields and try again.');
        const fieldErrors = result?.details?.fieldErrors as
          | Record<string, string[] | undefined>
          | undefined;
        if (fieldErrors) {
          setDetails(
            Object.entries(fieldErrors)
              .map(([field, messages]) => (messages?.length ? `${field}: ${messages[0]}` : ''))
              .filter(Boolean)
          );
        }
        return;
      }

      router.push('/admin/stays');
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/stays"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to stays
        </Link>
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {stay ? 'Save changes' : 'Create stay'}
            </>
          )}
        </button>
      </div>

      {error ? (
        <div
          role="alert"
          className="rounded-xl border border-clay/30 bg-clay/5 px-4 py-3 text-[12.5px] leading-relaxed text-ink"
        >
          <p className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
            {error}
          </p>
          {details.length ? (
            <ul className="mt-2 list-disc space-y-0.5 pl-8 text-[11.5px] text-clay">
              {details.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
          Basics
        </h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className={label}>
            Name
            <input name="name" required defaultValue={stay?.name} className={input} />
          </label>
          <label className={label}>
            Slug
            <input
              name="slug"
              required
              defaultValue={stay?.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className={input}
            />
            <span className={hint}>Used in the URL, e.g. virunga-lodge.</span>
          </label>
          <label className={label}>
            Stay type
            <select name="type" defaultValue={stay?.type ?? 'Hotels'} className={input}>
              {STAY_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Region
            <select name="region" defaultValue={stay?.region ?? 'kigali'} className={input}>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <label className={`${label} sm:col-span-2`}>
            Location
            <input
              name="location"
              required
              defaultValue={stay?.location}
              placeholder="Musanze, Volcanoes"
              className={input}
            />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Tagline
            <input
              name="tagline"
              required
              defaultValue={stay?.tagline}
              placeholder="A short line used on cards."
              className={input}
            />
          </label>
          <label className={label}>
            Nightly price (RWF)
            <input
              name="price"
              type="number"
              min={1}
              required
              defaultValue={stay?.price}
              className={input}
            />
          </label>
          <label className={label}>
            Badge (optional)
            <input
              name="badge"
              defaultValue={stay?.badge ?? ''}
              placeholder="Guest favourite"
              className={input}
            />
          </label>
          <label className={label}>
            Rating (0–5)
            <input
              name="rating"
              type="number"
              step="0.1"
              min={0}
              max={5}
              required
              defaultValue={stay?.rating ?? 0}
              className={input}
            />
          </label>
          <label className={label}>
            Reviews
            <input
              name="reviews"
              type="number"
              min={0}
              required
              defaultValue={stay?.reviews ?? 0}
              className={input}
            />
          </label>
          <label className={label}>
            Max guests
            <input
              name="capacity"
              type="number"
              min={1}
              required
              defaultValue={stay?.capacity ?? 2}
              className={input}
            />
          </label>
          <label className={label}>
            Beds
            <input
              name="beds"
              required
              defaultValue={stay?.beds}
              placeholder="1 king bed · 2 singles"
              className={input}
            />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
          Content
        </h2>
        <div className="mt-4 grid gap-4">
          <label className={label}>
            Image paths
            <textarea
              name="images"
              required
              rows={3}
              defaultValue={stay?.images.join('\n')}
              placeholder="/images/stays/example.jpg"
              className={`${input} font-mono text-[12.5px]`}
            />
            <span className={hint}>One image path per line. The first is used as the cover.</span>
          </label>
          <label className={label}>
            Description
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={stay?.description.join('\n')}
              placeholder="One paragraph per line."
              className={input}
            />
            <span className={hint}>One paragraph per line.</span>
          </label>
          <label className={label}>
            Amenities
            <textarea
              name="amenities"
              required
              rows={5}
              defaultValue={stay?.amenities.join('\n')}
              placeholder="Fast Wi-Fi"
              className={input}
            />
            <span className={hint}>One amenity per line.</span>
          </label>
          <label className={label}>
            Nearby places
            <textarea
              name="nearby"
              rows={3}
              defaultValue={stay?.nearby.map((item) => `${item.name} | ${item.distance}`).join('\n')}
              placeholder="Volcanoes National Park | 12 min drive"
              className={input}
            />
            <span className={hint}>One per line, in the form “Name | distance”.</span>
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
          Host
        </h2>
        <div className="mt-4 grid gap-4">
          <label className={label}>
            Host name
            <input name="host" required defaultValue={stay?.host} className={input} />
          </label>
          <label className={label}>
            Host note
            <textarea name="hostNote" rows={3} defaultValue={stay?.hostNote} className={input} />
          </label>
        </div>
      </section>

      <div className="flex justify-end">
        <button type="submit" disabled={busy} className="btn-primary">
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              {stay ? 'Save changes' : 'Create stay'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
