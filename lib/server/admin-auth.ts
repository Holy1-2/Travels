import { createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { ApiError } from './http';
import { siteUrl } from './site-url';

export const ADMIN_COOKIE = 'hamubere_admin';
const SESSION_HOURS = 8;

export function adminPassword() {
  const configured = process.env.ADMIN_PASSWORD?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV !== 'production') return 'hamubere-admin';
  return '';
}

export function adminEnabled() {
  return Boolean(adminPassword());
}

function sessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    `${adminPassword()}:hamubere-admin-session-v1`
  );
}

function sign(value: string) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

export function createSessionToken() {
  const expires = Date.now() + SESSION_HOURS * 60 * 60 * 1000;
  const payload = `v1.${expires}`;
  return `${payload}.${sign(payload)}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [version, expiresRaw, signature] = parts;
  if (version !== 'v1') return false;

  const expires = Number(expiresRaw);
  if (!Number.isFinite(expires) || expires < Date.now()) return false;

  const expected = sign(`${version}.${expiresRaw}`);
  const actualBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function passwordMatches(candidate: string) {
  const expected = adminPassword();
  if (!expected) return false;

  const actualBuffer = Buffer.from(candidate);
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length) return false;
  return timingSafeEqual(actualBuffer, expectedBuffer);
}

export function parseCookieHeader(header: string | null) {
  if (!header) return {};
  const result: Record<string, string> = {};

  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator === -1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();
    if (key) result[key] = decodeURIComponent(value);
  }

  return result;
}

export function isAdminRequest(request: Request) {
  const token = parseCookieHeader(request.headers.get('cookie'))[ADMIN_COOKIE];
  return verifySessionToken(token);
}

export function assertAdminRequest(request: Request) {
  if (!isAdminRequest(request)) {
    throw new ApiError(401, 'Sign in to the admin panel first.', 'unauthorized');
  }
}

export async function isAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export async function requireAdminPage() {
  const authenticated = await isAdminSession();
  if (!authenticated) redirect('/admin/login');
}

export const ADMIN_COOKIE_OPTIONS = {
  name: ADMIN_COOKIE,
  httpOnly: true,
  sameSite: 'lax' as const,
  // Secure over HTTPS in production, but allow local `next start` testing.
  secure:
    process.env.NODE_ENV === 'production' &&
    !/^http:\/\/(localhost|127\.0\.0\.1)(:|\/|$)/.test(siteUrl()),
  path: '/',
  maxAge: SESSION_HOURS * 60 * 60,
};
