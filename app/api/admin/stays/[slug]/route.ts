import { assertAdminRequest } from '@/lib/server/admin-auth';
import { ApiError, errorResponse, json, readJson } from '@/lib/server/http';
import { deleteStay, getStayBySlug, saveStay } from '@/lib/server/content';
import { adminStaySchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    assertAdminRequest(request);
    const { slug } = await params;
    const stay = getStayBySlug(slug);
    if (!stay) throw new ApiError(404, 'Stay not found.', 'not_found');
    return json({ ok: true, stay });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    assertAdminRequest(request);
    const { slug } = await params;
    if (!getStayBySlug(slug)) throw new ApiError(404, 'Stay not found.', 'not_found');
    const payload = adminStaySchema.parse(await readJson(request));
    const stay = saveStay(payload, slug);
    return json({ ok: true, stay });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    assertAdminRequest(request);
    const { slug } = await params;
    const deleted = deleteStay(slug);
    if (!deleted) throw new ApiError(404, 'Stay not found.', 'not_found');
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
