'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Database, Loader2, RotateCcw, Trash2 } from 'lucide-react';

export default function ContentTools({
  stays,
  experiences,
  demoStays,
  demoExperiences,
}: {
  stays: number;
  experiences: number;
  demoStays: number;
  demoExperiences: number;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<'clear' | 'restore' | null>(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const demoTotal = demoStays + demoExperiences;

  async function run(action: 'clear' | 'restore') {
    if (action === 'clear') {
      const confirmed = window.confirm(
        'Remove every seeded demo stay and experience? Content you created in the admin panel stays. This cannot be undone unless you restore the demo content afterwards.'
      );
      if (!confirmed) return;
    }

    setBusy(action);
    setError('');
    setMessage('');

    try {
      const response = await fetch(`/api/admin/content?action=${action}`, { method: 'POST' });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'That action could not be completed.');
        return;
      }

      setMessage(
        action === 'clear'
          ? `Removed ${payload.removed?.stays ?? 0} demo stays and ${
              payload.removed?.experiences ?? 0
            } demo experiences.`
          : `Restored ${payload.seeded?.stays ?? 0} stays and ${
              payload.seeded?.experiences ?? 0
            } experiences.`
      );
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-white p-5">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-soft text-forest">
          <Database className="h-4 w-4" strokeWidth={1.8} />
        </span>
        <div>
          <h2 className="font-display text-[16px] font-semibold tracking-[-0.02em] text-ink">
            Demo content
          </h2>
          <p className="mt-1 text-[12.5px] leading-relaxed text-mute">
            {demoTotal > 0
              ? `${demoTotal} seeded demo ${demoTotal === 1 ? 'listing is' : 'listings are'} still live. Clear them once your own content is ready.`
              : 'No demo content is live. You can restore the original sample listings at any time.'}
          </p>
          <p className="mt-1.5 text-[11.5px] text-mute">
            {stays} stays · {experiences} experiences in total
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => run('clear')}
          disabled={busy !== null || demoTotal === 0}
          className="inline-flex items-center gap-2 rounded-full border border-clay/30 bg-white px-4 py-2 text-[12.5px] font-semibold text-clay transition hover:bg-clay/[0.05] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy === 'clear' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Clear demo content
        </button>
        <button
          type="button"
          onClick={() => run('restore')}
          disabled={busy !== null}
          className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[12.5px] font-semibold text-ink transition hover:bg-soft disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy === 'restore' ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
          Restore demo content
        </button>
      </div>

      {error ? (
        <p role="alert" className="mt-3 flex items-start gap-2 text-[12px] leading-relaxed text-clay">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
      {message ? <p className="mt-3 text-[12px] text-forest">{message}</p> : null}
    </div>
  );
}
