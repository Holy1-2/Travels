import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json, readJson } from '@/lib/server/http';
import { getStays, saveStay } from '@/lib/server/content';
import { adminStaySchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    assertAdminRequest(request);
    return json({ ok: true, stays: getStays() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertAdminRequest(request);
    const payload = adminStaySchema.parse(await readJson(request));
    const stay = saveStay(payload);
    return json({ ok: true, stay }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
