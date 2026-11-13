import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json, readJson } from '@/lib/server/http';
import { getExperiences, saveExperience } from '@/lib/server/content';
import { adminExperienceSchema } from '@/lib/server/validation';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    assertAdminRequest(request);
    return json({ ok: true, experiences: getExperiences() });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    assertAdminRequest(request);
    const payload = adminExperienceSchema.parse(await readJson(request));
    const experience = saveExperience(payload);
    return json({ ok: true, experience }, { status: 201 });
  } catch (error) {
    return errorResponse(error);
  }
}
