import { assertAdminRequest } from '@/lib/server/admin-auth';
import { ApiError, errorResponse, json, readJson } from '@/lib/server/http';
import { deleteExperience, getExperienceBySlug, saveExperience } from '@/lib/server/content';
import { adminExperienceSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    assertAdminRequest(request);
    const { slug } = await params;
    const experience = getExperienceBySlug(slug);
    if (!experience) throw new ApiError(404, 'Experience not found.', 'not_found');
    return json({ ok: true, experience });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    assertAdminRequest(request);
    const { slug } = await params;
    if (!getExperienceBySlug(slug)) throw new ApiError(404, 'Experience not found.', 'not_found');
    const payload = adminExperienceSchema.parse(await readJson(request));
    const experience = saveExperience(payload, slug);
    return json({ ok: true, experience });
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
    const deleted = deleteExperience(slug);
    if (!deleted) throw new ApiError(404, 'Experience not found.', 'not_found');
    return json({ ok: true });
  } catch (error) {
    return errorResponse(error);
  }
}
