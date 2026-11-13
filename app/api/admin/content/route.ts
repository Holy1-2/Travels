import { assertAdminRequest } from '@/lib/server/admin-auth';
import { errorResponse, json } from '@/lib/server/http';
import { clearDemoContent, countContent, seedDemoContent } from '@/lib/server/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    assertAdminRequest(request);
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    if (action === 'clear') {
      const removed = clearDemoContent();
      return json({ ok: true, action: 'clear', removed, content: countContent() });
    }

    if (action === 'restore') {
      const seeded = seedDemoContent(true);
      return json({ ok: true, action: 'restore', seeded, content: countContent() });
    }

    return json({ ok: false, error: 'Use action=clear or action=restore.' }, { status: 422 });
  } catch (error) {
    return errorResponse(error);
  }
}
