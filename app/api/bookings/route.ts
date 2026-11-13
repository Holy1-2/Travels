import { NextResponse } from 'next/server';
import { assertSameOrigin, errorResponse, json, readJson } from '@/lib/server/http';
import { rateLimit, clientIp } from '@/lib/server/rate-limit';
import { createBookingSchema } from '@/lib/server/validation';
import { createBooking } from '@/lib/server/bookings';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);

    const limit = rateLimit(`bookings:create:${clientIp(request)}`, 12, 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many booking attempts. Please wait a minute and try again.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const payload = createBookingSchema.parse(await readJson(request));

    const booking = createBooking({
      kind: payload.kind,
      slug: payload.slug,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut ?? null,
      guests: payload.guests,
      guest: payload.guest,
      notes: payload.notes,
    });

    return json({ ok: true, booking }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function GET() {
  return new NextResponse(null, { status: 405, headers: { Allow: 'POST' } });
}
