import { errorResponse, json } from '@/lib/server/http';
import { getBooking } from '@/lib/server/bookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params;
    const booking = getBooking(reference);

    if (!booking) {
      return json({ ok: false, error: 'Booking not found.', code: 'not_found' }, { status: 404 });
    }

    return json({ ok: true, booking });
  } catch (error) {
    return errorResponse(error);
  }
}
