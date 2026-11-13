'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

const STATUSES = ['new', 'reviewing', 'approved', 'declined'] as const;
type RequestStatus = (typeof STATUSES)[number];

export default function ListingRequestStatus({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState<string>(status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function update(next: string) {
    const previous = value;
    setValue(next);
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/admin/listing-requests', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: next }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setValue(previous);
        setError(payload.error || 'Could not update.');
        return;
      }

      router.refresh();
    } catch {
      setValue(previous);
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <label className="relative inline-flex items-center">
        <span className="sr-only">Request status</span>
        <select
          value={value}
          onChange={(event) => update(event.target.value as RequestStatus)}
          disabled={busy}
          className="appearance-none rounded-full border border-line bg-white py-1.5 pl-3 pr-8 text-[12px] font-semibold capitalize text-ink outline-none transition focus:border-forest/40 focus:ring-4 focus:ring-forest/5 disabled:opacity-60"
        >
          {STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {busy ? (
          <Loader2 className="absolute right-2.5 h-3.5 w-3.5 animate-spin text-mute" />
        ) : (
          <span className="pointer-events-none absolute right-2.5 text-[9px] text-mute">▼</span>
        )}
      </label>
      {error ? <p className="mt-1 text-[11px] text-clay">{error}</p> : null}
    </div>
  );
}
