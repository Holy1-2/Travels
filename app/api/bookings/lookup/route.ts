import { errorResponse, json } from '@/lib/server/http';
import { findBookingByReferenceAndEmail } from '@/lib/server/bookings';
import { lookupBookingSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const payload = lookupBookingSchema.parse({
      reference: url.searchParams.get('reference') ?? '',
      email: url.searchParams.get('email') ?? '',
    });

    const booking = findBookingByReferenceAndEmail(payload.reference, payload.email);

    if (!booking) {
      return json(
        {
          ok: false,
          error: 'No booking matches that reference and email.',
          code: 'not_found',
        },
        { status: 404 }
      );
    }

    return json({ ok: true, booking });
  } catch (error) {
    return errorResponse(error);
  }
}
