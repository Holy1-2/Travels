import { NextResponse } from 'next/server';
import { errorResponse, json, readJson } from '@/lib/server/http';
import { clientIp, rateLimit } from '@/lib/server/rate-limit';
import {
  ADMIN_COOKIE_OPTIONS,
  adminEnabled,
  createSessionToken,
  passwordMatches,
} from '@/lib/server/admin-auth';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const limit = rateLimit(`admin:login:${clientIp(request)}`, 8, 5 * 60_000);
    if (!limit.ok) {
      return json(
        { ok: false, error: 'Too many attempts. Please wait a few minutes.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
      );
    }

    if (!adminEnabled()) {
      return json(
        {
          ok: false,
          error: 'Admin access is not configured. Set ADMIN_PASSWORD on the server.',
          code: 'admin_disabled',
        },
        { status: 503 }
      );
    }

    const body = (await readJson(request)) as { password?: unknown };
    const password = typeof body.password === 'string' ? body.password : '';

    if (!password || !passwordMatches(password)) {
      return json(
        { ok: false, error: 'That password is not correct.', code: 'invalid_password' },
        { status: 401 }
      );
    }

    const response = NextResponse.json({ ok: true });
    response.cookies.set({ ...ADMIN_COOKIE_OPTIONS, value: createSessionToken() });
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}
