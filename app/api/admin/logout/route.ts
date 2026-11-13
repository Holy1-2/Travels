import { NextResponse } from 'next/server';
import { ADMIN_COOKIE_OPTIONS } from '@/lib/server/admin-auth';

export const runtime = 'nodejs';

export async function POST() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set({ ...ADMIN_COOKIE_OPTIONS, value: '', maxAge: 0 });
  return response;
}
