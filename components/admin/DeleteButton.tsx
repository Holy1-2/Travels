'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Trash2 } from 'lucide-react';

export default function DeleteButton({
  url,
  label = 'Delete',
  confirmMessage,
  redirectTo,
}: {
  url: string;
  label?: string;
  confirmMessage: string;
  redirectTo?: string;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function remove() {
    if (!window.confirm(confirmMessage)) return;

    setBusy(true);
    setError('');

    try {
      const response = await fetch(url, { method: 'DELETE' });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        setError(payload.error || 'Could not delete that item.');
        return;
      }

      if (redirectTo) {
        router.push(redirectTo);
      }
      router.refresh();
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <span className="inline-flex flex-col items-start gap-1">
      <button
        type="button"
        onClick={remove}
        disabled={busy}
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[12px] font-semibold text-clay transition hover:bg-clay/[0.07] disabled:opacity-50"
      >
        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        {label}
      </button>
      {error ? <span className="text-[11px] text-clay">{error}</span> : null}
    </span>
  );
}
