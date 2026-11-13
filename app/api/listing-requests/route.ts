import { assertSameOrigin, errorResponse, json, readJson } from '@/lib/server/http';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import { execute, nowISO } from '@/lib/server/db';
import { listingRequestId } from '@/lib/server/references';
import { listingRequestSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    assertSameOrigin(request);

    const limit = rateLimit(`listing:create:${clientIp(request)}`, 5, 10 * 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many submissions. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    const payload = listingRequestSchema.parse(await readJson(request));
    const id = listingRequestId();

    await execute(
      `INSERT INTO listing_requests (
        id, property_name, property_type, region, rooms, contact_name,
        email, phone, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'new', ?)`,
      [
        id,
        payload.propertyName,
        payload.propertyType,
        payload.region,
        payload.rooms,
        payload.contactName,
        payload.email.toLowerCase(),
        payload.phone,
        payload.notes,
        nowISO(),
      ]
    );

    return json(
      {
        ok: true,
        request: { id, propertyName: payload.propertyName, status: 'new' },
      },
      { status: 201 }
    );
  } catch (error) {
    return errorResponse(error);
  }
}
