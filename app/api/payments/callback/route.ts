import { NextResponse } from 'next/server';
import { getPaymentById, settleVerifiedTransaction } from '@/lib/server/payments';
import { verifyTransaction } from '@/lib/server/payments/flutterwave';
import { siteUrl } from '@/lib/server/site-url';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Flutterwave redirects the payer here after the hosted card checkout.
 * We never trust the query string alone: the transaction is verified with the
 * provider before the booking is marked paid.
 */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const transactionId = url.searchParams.get('transaction_id');
  const txRef = url.searchParams.get('tx_ref');
  const status = url.searchParams.get('status');

  const payment = txRef ? getPaymentById(txRef) : undefined;
  const bookingReference = payment?.booking_reference;

  if (!payment || !bookingReference) {
    return NextResponse.redirect(`${siteUrl()}/bookings?payment=unknown`);
  }

  if (status === 'cancelled') {
    return NextResponse.redirect(
      `${siteUrl()}/bookings/${bookingReference}?payment=cancelled`
    );
  }

  if (!transactionId) {
    return NextResponse.redirect(
      `${siteUrl()}/bookings/${bookingReference}?payment=failed`
    );
  }

  try {
    const transaction = await verifyTransaction(transactionId);
    const result = settleVerifiedTransaction(transaction);

    if (result.ok) {
      return NextResponse.redirect(
        `${siteUrl()}/bookings/${result.bookingReference}?payment=success`
      );
    }

    return NextResponse.redirect(
      `${siteUrl()}/bookings/${bookingReference}?payment=failed`
    );
  } catch (error) {
    console.error('[payments] callback verification failed', error);
    return NextResponse.redirect(
      `${siteUrl()}/bookings/${bookingReference}?payment=pending`
    );
  }
}
