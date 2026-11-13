'use client';

import { useState } from 'react';
import { AlertCircle, ArrowRight, Check, Loader2, ShieldCheck } from 'lucide-react';
import { regions, STAY_TYPES } from '@/lib/data';

const inputClass =
  'mt-1.5 w-full rounded-xl border border-line bg-white px-4 py-3 text-[14.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5';

const labelClass = 'block text-[12.5px] font-medium text-ink';

export default function PropertyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [reference, setReference] = useState('');
  const [propertyName, setPropertyName] = useState('');

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    const data = new FormData(event.currentTarget);
    const name = String(data.get('property') || '');

    try {
      const response = await fetch('/api/listing-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyName: name,
          propertyType: String(data.get('type') || ''),
          region: String(data.get('region') || ''),
          rooms: Number(data.get('rooms') || 0),
          contactName: String(data.get('name') || ''),
          email: String(data.get('email') || ''),
          phone: String(data.get('phone') || ''),
          notes: String(data.get('notes') || ''),
        }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'We could not send that. Please check the details and try again.');
        return;
      }

      setPropertyName(name);
      setReference(payload.request.id);
      setSubmitted(true);
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border border-line bg-white p-8 text-center shadow-soft sm:p-12">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest text-white">
          <Check className="h-6 w-6" strokeWidth={2.2} />
        </span>
        <h2 className="mt-5 font-display text-[26px] font-semibold tracking-[-0.03em] text-ink">
          Thanks — we have your details.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-[14.5px] leading-relaxed text-mute">
          {propertyName ? `${propertyName} is now` : 'Your property is now'} in our review queue. A
          member of the Kigali team will reply within one working day to arrange a visit.
        </p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-line bg-soft px-4 py-2 text-[13px]">
          <span className="text-mute">Reference</span>
          <strong className="font-semibold tracking-wide text-ink">{reference}</strong>
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <button type="button" onClick={() => setSubmitted(false)} className="btn-outline">
            Submit another property
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-white p-6 shadow-soft sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className={`${labelClass} sm:col-span-2`}>
          Property name
          <input
            name="property"
            required
            autoComplete="organization"
            placeholder="e.g. Hillside Lodge Musanze"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Property type
          <select name="type" required defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>
              Select a type
            </option>
            {STAY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Region
          <select name="region" required defaultValue="" className={`${inputClass} cursor-pointer`}>
            <option value="" disabled>
              Select a region
            </option>
            {regions.map((region) => (
              <option key={region.slug} value={region.slug}>
                {region.name} — {region.place}
              </option>
            ))}
          </select>
        </label>

        <label className={labelClass}>
          Number of rooms
          <input
            name="rooms"
            type="number"
            min={1}
            max={200}
            required
            placeholder="8"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Your name
          <input name="name" required autoComplete="name" placeholder="Full name" className={inputClass} />
        </label>

        <label className={labelClass}>
          Email
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={inputClass}
          />
        </label>

        <label className={labelClass}>
          Phone / WhatsApp
          <input
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            placeholder="+250 7xx xxx xxx"
            className={inputClass}
          />
        </label>

        <label className={`${labelClass} sm:col-span-2`}>
          Anything we should know?
          <textarea
            name="notes"
            rows={4}
            placeholder="Tell us about the property, the view, or the kind of guests you host."
            className={`${inputClass} resize-y`}
          />
        </label>
      </div>

      {error ? (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-clay/30 bg-clay/5 px-4 py-3 text-[12.5px] leading-relaxed text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
          {error}
        </p>
      ) : null}

      <div className="mt-6 flex flex-col gap-4 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="flex items-start gap-2 text-[12px] leading-relaxed text-mute">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.8} />
          No listing fee. We visit every property before it goes live.
        </p>
        <button type="submit" disabled={submitting} className="btn-primary shrink-0">
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending
            </>
          ) : (
            <>
              Request a listing
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </div>
    </form>
  );
}
