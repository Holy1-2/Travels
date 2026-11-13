import { assertAdminRequest } from '@/lib/server/admin-auth';
import { ApiError, errorResponse, json, readJson } from '@/lib/server/http';
import { adminUpdateBooking, getBooking, getBookingEvents } from '@/lib/server/bookings';
import { adminBookingUpdateSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ reference: string }> }) {
  try {
    assertAdminRequest(request);
    const { reference } = await params;
    const booking = getBooking(reference);
    if (!booking) throw new ApiError(404, 'Booking not found.', 'not_found');
    return json({ ok: true, booking, events: getBookingEvents(reference) });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    assertAdminRequest(request);
    const { reference } = await params;
    const payload = adminBookingUpdateSchema.parse(await readJson(request));
    const booking = adminUpdateBooking(reference, payload);
    return json({ ok: true, booking });
  } catch (error) {
    return errorResponse(error);
  }
}
