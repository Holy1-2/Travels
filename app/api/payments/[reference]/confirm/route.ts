import { assertSameOrigin, errorResponse, json, readJson } from '@/lib/server/http';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { getBooking } from '@/lib/server/bookings';
import { confirmSandboxPayment } from '@/lib/server/payments';
import { confirmPaymentSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    assertSameOrigin(request);

    const limit = rateLimit(`payments:confirm:${clientIp(request)}`, 20, 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many attempts. Please wait a minute.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const { reference } = await params;
    const payload = confirmPaymentSchema.parse(await readJson(request));
    const payment = confirmSandboxPayment(reference, payload.paymentId);

    return json({
      ok: true,
      payment: {
        id: payment.id,
        status: payment.status,
        amount: payment.amount,
        currency: payment.currency,
      },
      booking: getBooking(reference),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
