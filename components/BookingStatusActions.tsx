'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Check,
  Copy,
  Loader2,
  Printer,
  RefreshCw,
  XCircle,
} from 'lucide-react';
import type { BookingPaymentStatus, BookingStatus } from '@/lib/server/types';

export default function BookingStatusActions({
  reference,
  email,
  paymentStatus,
  status,
}: {
  reference: string;
  email: string;
  paymentStatus: BookingPaymentStatus;
  status: BookingStatus;
}) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [checking, setChecking] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState('');

  const paid = paymentStatus === 'paid';
  const processing = paymentStatus === 'processing';
  const cancelled = status === 'cancelled';

  useEffect(() => {
    if (!processing) return;

    const tick = async () => {
      try {
        const response = await fetch(`/api/bookings/${reference}`, { cache: 'no-store' });
        if (!response.ok) return;
        const payload = await response.json();
        if (payload.booking?.paymentStatus === 'paid') {
          router.push(`/bookings/${reference}?payment=success`);
          router.refresh();
        } else if (payload.booking?.paymentStatus === 'failed') {
          router.refresh();
        }
      } catch {
        // Ignore transient errors while polling.
      }
    };

    const interval = window.setInterval(tick, 6000);
    return () => window.clearInterval(interval);
  }, [processing, reference, router]);

  const copyReference = async () => {
    try {
      await navigator.clipboard.writeText(reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError('Copy failed. Select the reference manually.');
    }
  };

  const checkStatus = async () => {
    setChecking(true);
    setError('');
    try {
      const response = await fetch(`/api/bookings/${reference}`, { cache: 'no-store' });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not check the status.');
      if (payload.booking?.paymentStatus === 'paid') {
        router.push(`/bookings/${reference}?payment=success`);
      }
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not check the status.');
    } finally {
      setChecking(false);
    }
  };

  const cancelBooking = async () => {
    const confirmed = window.confirm(
      'Cancel this booking? The dates will be released and no payment will be taken.'
    );
    if (!confirmed) return;

    setCancelling(true);
    setError('');
    try {
      const response = await fetch(`/api/bookings/${reference}/cancel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || 'Could not cancel this booking.');
      router.refresh();
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not cancel this booking.');
    } finally {
      setCancelling(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5">
        {!paid && !cancelled ? (
          <a href={`/checkout?reference=${reference}`} className="btn-primary">
            {processing ? 'Payment pending — check or retry' : 'Complete payment'}
            <ArrowRight className="h-4 w-4" />
          </a>
        ) : null}

        {processing ? (
          <button type="button" onClick={checkStatus} disabled={checking} className="btn-outline">
            {checking ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
            Check status
          </button>
        ) : null}

        <button type="button" onClick={copyReference} className="btn-outline">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied' : 'Copy reference'}
        </button>

        <button type="button" onClick={() => window.print()} className="btn-outline">
          <Printer className="h-4 w-4" />
          Print
        </button>

        {!paid && !cancelled ? (
          <button
            type="button"
            onClick={cancelBooking}
            disabled={cancelling}
            className="inline-flex items-center gap-2 rounded-full px-3 py-2.5 text-[13px] font-medium text-mute transition hover:bg-soft hover:text-clay"
          >
            {cancelling ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
            Cancel booking
          </button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-[12.5px] text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
