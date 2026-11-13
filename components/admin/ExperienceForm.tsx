'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AlertCircle, ArrowLeft, Loader2, Save } from 'lucide-react';
import { regions, type Experience } from '@/lib/data';

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

export default function ExperienceForm({ experience }: { experience?: Experience }) {
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
    const payload = {
      slug: String(data.get('slug') ?? '').trim(),
      name: String(data.get('name') ?? '').trim(),
      region: String(data.get('region') ?? ''),
      duration: String(data.get('duration') ?? '').trim(),
      price: Number(data.get('price') ?? 0),
      groupSize: String(data.get('groupSize') ?? '').trim(),
      image: String(data.get('image') ?? '').trim(),
      summary: String(data.get('summary') ?? '').trim(),
      description: lines(data.get('description')),
      includes: lines(data.get('includes')),
      meetingPoint: String(data.get('meetingPoint') ?? '').trim(),
    };

    const endpoint = experience
      ? `/api/admin/experiences/${encodeURIComponent(experience.slug)}`
      : '/api/admin/experiences';

    try {
      const response = await fetch(endpoint, {
        method: experience ? 'PUT' : 'POST',
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

      router.push('/admin/experiences');
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
          href="/admin/experiences"
          className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to experiences
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
              {experience ? 'Save changes' : 'Create experience'}
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
            <input name="name" required defaultValue={experience?.name} className={input} />
          </label>
          <label className={label}>
            Slug
            <input
              name="slug"
              required
              defaultValue={experience?.slug}
              pattern="[a-z0-9]+(-[a-z0-9]+)*"
              className={input}
            />
            <span className={hint}>Used in the URL, e.g. gorilla-trekking.</span>
          </label>
          <label className={label}>
            Region
            <select name="region" defaultValue={experience?.region ?? 'kigali'} className={input}>
              {regions.map((region) => (
                <option key={region.slug} value={region.slug}>
                  {region.name}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            Duration
            <input
              name="duration"
              required
              defaultValue={experience?.duration}
              placeholder="Full day · 6 hours"
              className={input}
            />
          </label>
          <label className={label}>
            Price per person (RWF)
            <input
              name="price"
              type="number"
              min={1}
              required
              defaultValue={experience?.price}
              className={input}
            />
          </label>
          <label className={label}>
            Group size
            <input
              name="groupSize"
              required
              defaultValue={experience?.groupSize}
              placeholder="Up to 8 guests"
              className={input}
            />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Image path
            <input
              name="image"
              required
              defaultValue={experience?.image}
              placeholder="/images/experiences/example.jpg"
              className={`${input} font-mono text-[12.5px]`}
            />
          </label>
          <label className={`${label} sm:col-span-2`}>
            Meeting point
            <input
              name="meetingPoint"
              required
              defaultValue={experience?.meetingPoint}
              placeholder="Kinigi park headquarters, Musanze"
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
            Summary
            <textarea
              name="summary"
              required
              rows={2}
              defaultValue={experience?.summary}
              className={input}
            />
          </label>
          <label className={label}>
            Description
            <textarea
              name="description"
              required
              rows={5}
              defaultValue={experience?.description.join('\n')}
              placeholder="One paragraph per line."
              className={input}
            />
            <span className={hint}>One paragraph per line.</span>
          </label>
          <label className={label}>
            What&apos;s included
            <textarea
              name="includes"
              required
              rows={4}
              defaultValue={experience?.includes.join('\n')}
              placeholder="Licensed guide"
              className={input}
            />
            <span className={hint}>One inclusion per line.</span>
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
              {experience ? 'Save changes' : 'Create experience'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
