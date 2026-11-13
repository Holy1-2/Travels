import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { adminEnabled, isAdminSession } from '@/lib/server/admin-auth';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin sign in',
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  if (await isAdminSession()) redirect('/admin');

  const enabled = adminEnabled();

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-wash px-4 py-12">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-mute transition hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to the site
        </Link>

        <div className="mt-6 rounded-2xl border border-line bg-white p-7 shadow-soft sm:p-8">
          <span className="grid h-11 w-11 place-items-center rounded-full bg-forest text-white">
            <ShieldCheck className="h-5 w-5" strokeWidth={1.8} />
          </span>
          <h1 className="mt-4 font-display text-[28px] font-semibold tracking-[-0.03em] text-ink">
            Hamubere admin
          </h1>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-mute">
            Manage bookings, stays, experiences and host requests.
          </p>

          {enabled ? (
            <AdminLoginForm />
          ) : (
            <div className="mt-6 rounded-xl border border-clay/30 bg-clay/5 p-4 text-[12.5px] leading-relaxed text-ink">
              <p className="font-semibold">Admin access is not configured.</p>
              <p className="mt-1 text-mute">
                Add an <code className="rounded bg-white px-1 py-0.5">ADMIN_PASSWORD</code> environment
                variable on the server, then reload this page. In local development the fallback is{' '}
                <code className="rounded bg-white px-1 py-0.5">hamubere-admin</code>.
              </p>
            </div>
          )}
        </div>

        <p className="mt-5 text-center text-[11.5px] text-mute">
          Sessions expire after 8 hours. This page is not indexed.
        </p>
      </div>
    </div>
  );
}
