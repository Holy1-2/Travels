import type { PoolConnection } from 'mysql2/promise';
import { nowISO, query, queryOne, transaction } from './db';
import { ApiError } from './http';
import { getBookingRow, markBookingPaid, markBookingPaymentFailed, recordEvent } from './bookings';
import { paymentId as newPaymentId } from './references';
import type { PaymentMethod, PaymentProvider, PaymentRow, PaymentStatus } from './types';
import {
  chargeMobileMoney,
  createCardCheckout,
  FlutterwaveError,
  paymentsAreSandbox,
  type VerifiedTransaction,
} from './payments/flutterwave';

export interface StartPaymentResult {
  payment: PaymentRow;
  sandbox: boolean;
  checkoutUrl: string | null;
  pendingProvider: boolean;
  message: string;
}

export function paymentMode() {
  return paymentsAreSandbox() ? 'sandbox' : 'live';
}

export async function getPaymentById(id: string) {
  return queryOne<PaymentRow>('SELECT * FROM payments WHERE id = ?', [id]);
}

const getPayment = getPaymentById;

async function updatePayment(
  id: string,
  values: Partial<
    Pick<PaymentRow, 'status' | 'provider_reference' | 'checkout_url' | 'failure_reason'>
  >,
  connection?: PoolConnection
) {
  const fields: string[] = [];
  const params: unknown[] = [];

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined) {
      fields.push(`${key} = ?`);
      params.push(value);
    }
  }

  fields.push('updated_at = ?');
  params.push(nowISO(), id);

  const sql = `UPDATE payments SET ${fields.join(', ')} WHERE id = ?`;
  if (connection) {
    await connection.query(sql, params);
  } else {
    await query(sql, params);
  }
}

export async function startPayment(
  reference: string,
  method: PaymentMethod,
  phone?: string
): Promise<StartPaymentResult> {
  const booking = await getBookingRow(reference);
  if (!booking) throw new ApiError(404, 'Booking not found.', 'not_found');
  if (booking.status === 'cancelled') {
    throw new ApiError(409, 'This booking was cancelled.', 'booking_cancelled');
  }
  if (booking.payment_status === 'paid') {
    throw new ApiError(409, 'This booking is already paid.', 'already_paid');
  }
  if ((method === 'mtn' || method === 'airtel') && !(phone || booking.guest_phone)) {
    throw new ApiError(422, 'Enter the mobile money number that will pay.', 'phone_required');
  }

  const sandbox = paymentsAreSandbox();
  const provider: PaymentProvider = sandbox ? 'sandbox' : 'flutterwave';
  const id = newPaymentId();
  const timestamp = nowISO();

  await transaction(async (connection) => {
    // Only one active payment attempt per booking.
    await connection.query(
      `UPDATE payments SET status = 'cancelled', updated_at = ?
       WHERE booking_reference = ? AND status IN ('pending', 'processing')`,
      [timestamp, booking.reference]
    );

    await connection.query(
      `INSERT INTO payments (
        id, booking_reference, provider, method, amount, currency, status,
        payer_phone, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)`,
      [
        id,
        booking.reference,
        provider,
        method,
        booking.total,
        booking.currency,
        phone || booking.guest_phone || null,
        timestamp,
        timestamp,
      ]
    );

    await connection.query(
      `UPDATE bookings SET payment_status = 'processing', updated_at = ?
       WHERE reference = ? AND payment_status != 'paid'`,
      [timestamp, booking.reference]
    );

    await recordEvent(booking.reference, 'payment_started', `${provider}:${method}`, connection);
  });

  const payment = (await getPayment(id))!;

  if (sandbox) {
    return {
      payment,
      sandbox: true,
      checkoutUrl: null,
      pendingProvider: false,
      message:
        'Test mode is active. No real money will be charged. Confirm the test payment to complete this booking.',
    };
  }

  try {
    if (method === 'card') {
      const link = await createCardCheckout({
        txRef: id,
        amount: booking.total,
        currency: booking.currency,
        customer: {
          email: booking.guest_email,
          name: booking.guest_name,
          phone: booking.guest_phone,
        },
        description: `${booking.item_name} · ${booking.reference}`,
        meta: { booking: booking.reference, payment: id },
      });

      await updatePayment(id, { status: 'pending', checkout_url: link });
      return {
        payment: { ...payment, checkout_url: link },
        sandbox: false,
        checkoutUrl: link,
        pendingProvider: false,
        message: 'Redirecting you to the secure card checkout.',
      };
    }

    const network = method === 'mtn' ? 'MTN' : 'AIRTEL';
    const result = await chargeMobileMoney({
      txRef: id,
      amount: booking.total,
      currency: booking.currency,
      network,
      phone: phone || booking.guest_phone,
      email: booking.guest_email,
      name: booking.guest_name,
      meta: { booking: booking.reference, payment: id },
    });

    await updatePayment(id, {
      status: 'processing',
      provider_reference: result.providerReference || null,
    });

    return {
      payment: {
        ...payment,
        status: 'processing',
        provider_reference: result.providerReference || null,
      },
      sandbox: false,
      checkoutUrl: result.redirect,
      pendingProvider: true,
      message:
        method === 'mtn'
          ? 'Approve the MTN MoMo prompt on your phone. This page updates once payment is confirmed.'
          : 'Approve the Airtel Money prompt on your phone. This page updates once payment is confirmed.',
    };
  } catch (error) {
    const message =
      error instanceof FlutterwaveError
        ? error.message
        : 'The payment provider could not start this payment.';
    await updatePayment(id, { status: 'failed', failure_reason: message });
    await markBookingPaymentFailed(booking.reference);
    throw new ApiError(502, message, 'payment_provider_error');
  }
}

export async function confirmSandboxPayment(reference: string, paymentIdentifier: string) {
  if (!paymentsAreSandbox()) {
    throw new ApiError(403, 'Test payments are disabled in live mode.', 'sandbox_disabled');
  }

  const payment = await getPayment(paymentIdentifier);
  if (!payment || payment.booking_reference !== reference.toUpperCase()) {
    throw new ApiError(404, 'Payment not found for this booking.', 'not_found');
  }
  if (payment.status === 'succeeded') {
    return (await getPayment(payment.id))!;
  }
  if (payment.status === 'cancelled' || payment.status === 'failed') {
    throw new ApiError(409, 'Start a new payment attempt.', 'payment_inactive');
  }
  if (payment.provider !== 'sandbox') {
    throw new ApiError(403, 'This payment is handled by the live provider.', 'wrong_provider');
  }

  await transaction(async (connection) => {
    await updatePayment(payment.id, { status: 'succeeded' }, connection);
    await markBookingPaid(reference, connection);
    await recordEvent(reference, 'sandbox_payment_confirmed', payment.id, connection);
  });

  return (await getPayment(payment.id))!;
}

export async function settleVerifiedTransaction(transactionRecord: VerifiedTransaction) {
  const payment = await getPayment(transactionRecord.txRef);
  if (!payment) return { ok: false as const, reason: 'payment_not_found' };

  if (transactionRecord.currency !== payment.currency) {
    await updatePayment(payment.id, {
      status: 'failed',
      failure_reason: `Currency mismatch (${transactionRecord.currency}).`,
    });
    await markBookingPaymentFailed(payment.booking_reference);
    return { ok: false as const, reason: 'currency_mismatch' };
  }

  if (Math.round(transactionRecord.amount) < payment.amount) {
    await updatePayment(payment.id, {
      status: 'failed',
      failure_reason: `Amount mismatch (${transactionRecord.amount} ${transactionRecord.currency}).`,
    });
    await markBookingPaymentFailed(payment.booking_reference);
    return { ok: false as const, reason: 'amount_mismatch' };
  }

  if (transactionRecord.status !== 'successful') {
    await updatePayment(payment.id, {
      status: transactionRecord.status === 'failed' ? 'failed' : 'processing',
      provider_reference: String(transactionRecord.id),
      failure_reason:
        transactionRecord.status === 'failed' ? 'The provider declined the payment.' : null,
    });
    if (transactionRecord.status === 'failed') {
      await markBookingPaymentFailed(payment.booking_reference);
    }
    return { ok: false as const, reason: 'not_successful' };
  }

  await transaction(async (connection) => {
    await updatePayment(
      payment.id,
      {
        status: 'succeeded',
        provider_reference: String(transactionRecord.id),
        failure_reason: null,
      },
      connection
    );
    await markBookingPaid(payment.booking_reference, connection);
    await recordEvent(
      payment.booking_reference,
      'payment_settled',
      `${payment.provider}:${transactionRecord.id}`,
      connection
    );
  });

  return {
    ok: true as const,
    bookingReference: payment.booking_reference,
    paymentId: payment.id,
  };
}

export async function latestPaymentForBooking(reference: string) {
  return queryOne<PaymentRow>(
    'SELECT * FROM payments WHERE booking_reference = ? ORDER BY created_at DESC LIMIT 1',
    [reference.toUpperCase()]
  );
}

export async function markPaymentStatus(id: string, status: PaymentStatus, reason?: string) {
  await updatePayment(id, { status, failure_reason: reason ?? null });
}
