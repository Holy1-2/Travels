import { errorResponse, json } from '@/lib/server/http';
import { bookedExperienceDates, bookedStayRanges } from '@/lib/server/bookings';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const kind = url.searchParams.get('kind') === 'experience' ? 'experience' : 'stay';
    const slug = url.searchParams.get('slug') ?? '';
    const from = url.searchParams.get('from') ?? '';
    const to = url.searchParams.get('to') ?? '';

    if (!slug) {
      return json(
        { ok: false, error: 'Add a slug to check availability.', code: 'validation_failed' },
        { status: 422 }
      );
    }

    if (kind === 'stay') {
      return json({ ok: true, kind, slug, ranges: bookedStayRanges(slug) });
    }

    if (!from || !to) {
      return json(
        { ok: false, error: 'Add from and to dates.', code: 'validation_failed' },
        { status: 422 }
      );
    }

    return json({
      ok: true,
      kind,
      slug,
      dates: bookedExperienceDates(slug, from, to),
    });
  } catch (error) {
    return errorResponse(error);
  }
}
