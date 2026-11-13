import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json } from '@/lib/server/http';
import { listBookings } from '@/lib/server/bookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    assertAdminRequest(request);
    const url = new URL(request.url);
    const limit = Number(url.searchParams.get('limit') ?? 50);
    const offset = Number(url.searchParams.get('offset') ?? 0);
    return json({ ok: true, bookings: listBookings(limit, offset) });
  } catch (error) {
    return errorResponse(error);
  }
}
