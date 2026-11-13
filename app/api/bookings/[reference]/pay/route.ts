import { assertSameOrigin, errorResponse, json, readJson } from '@/lib/server/http';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { getBooking } from '@/lib/server/bookings';
import { startPayment } from '@/lib/server/payments';
import { startPaymentSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    assertSameOrigin(request);

    const limit = rateLimit(`payments:start:${clientIp(request)}`, 15, 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many payment attempts. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const { reference } = await params;
    const payload = startPaymentSchema.parse(await readJson(request));
    const result = await startPayment(reference, payload.method, payload.phone);

    return json({
      ok: true,
      sandbox: result.sandbox,
      checkoutUrl: result.checkoutUrl,
      pendingProvider: result.pendingProvider,
      message: result.message,
      payment: {
        id: result.payment.id,
        amount: result.payment.amount,
        currency: result.payment.currency,
        status: result.payment.status,
        method: result.payment.method,
      },
      booking: getBooking(reference),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
