import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json } from '@/lib/server/http';
import { getBookingStats } from '@/lib/server/bookings';
import { countContent, getListingRequests } from '@/lib/server/content';
import { paymentMode } from '@/lib/server/payments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    assertAdminRequest(request);
    const requests = getListingRequests();

    return json({
      ok: true,
      stats: {
        ...getBookingStats(),
        content: countContent(),
        listingRequests: requests.length,
        newListingRequests: requests.filter((request) => request.status === 'new').length,
        paymentMode: paymentMode(),
      },
    });
  } catch (error) {
    return errorResponse(error);
  }
}
