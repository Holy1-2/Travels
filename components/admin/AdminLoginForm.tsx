'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, LockKeyhole } from 'lucide-react';

export default function AdminLoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: String(data.get('password') ?? '') }),
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.error || 'Sign-in failed.');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="mt-6">
      <label className="block text-[12.5px] font-medium text-ink">
        Admin password
        <span className="relative mt-1.5 block">
          <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-mute" />
          <input
            name="password"
            type="password"
            required
            autoFocus
            autoComplete="current-password"
            placeholder="Enter your password"
            className="w-full rounded-xl border border-line bg-white py-3 pl-10 pr-4 text-[14.5px] text-ink outline-none transition placeholder:text-mute/50 focus:border-forest/40 focus:ring-4 focus:ring-forest/5"
          />
        </span>
      </label>

      {error ? (
        <p role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-clay/30 bg-clay/5 px-3 py-2.5 text-[12.5px] leading-relaxed text-ink">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-clay" />
          {error}
        </p>
      ) : null}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full">
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Signing in
          </>
        ) : (
          'Sign in to admin'
        )}
      </button>
    </form>
  );
}
