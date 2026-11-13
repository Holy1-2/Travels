import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json, readJson } from '@/lib/server/http';
import { getListingRequests, updateListingRequestStatus } from '@/lib/server/content';
import { adminListingUpdateSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    assertAdminRequest(request);
    return json({ ok: true, requests: getListingRequests() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PATCH(request: Request) {
  try {
    assertAdminRequest(request);
    const body = (await readJson(request)) as { id?: string };
    const payload = adminListingUpdateSchema.parse(body);
    if (!body.id) {
      return json({ ok: false, error: 'Add a request id.' }, { status: 422 });
    }
    const requestRecord = updateListingRequestStatus(body.id, payload.status);
    return json({ ok: true, request: requestRecord });
  } catch (error) {
    return errorResponse(error);
  }
}
