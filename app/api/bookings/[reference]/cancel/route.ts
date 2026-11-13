import { assertSameOrigin, errorResponse, json, readJson } from '@/lib/server/http';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { cancelBookingSchema } from '@/lib/server/validation';
import { cancelBooking } from '@/lib/server/bookings';

export const runtime = 'nodejs';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    assertSameOrigin(request);

    const limit = rateLimit(`bookings:cancel:${clientIp(request)}`, 8, 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many attempts. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const { reference } = await params;
    const payload = cancelBookingSchema.parse(await readJson(request));
    const booking = cancelBooking(reference, payload.email);

    return json({ ok: true, booking });
  } catch (error) {
    return errorResponse(error);
  }
}
