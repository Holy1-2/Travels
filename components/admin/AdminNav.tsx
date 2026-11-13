'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  Compass,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  MessageSquare,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const LINKS = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
  { href: '/admin/stays', label: 'Stays', icon: BedDouble },
  { href: '/admin/experiences', label: 'Experiences', icon: Compass },
  { href: '/admin/listing-requests', label: 'Host requests', icon: MessageSquare },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href);

  const signOut = async () => {
    setSigningOut(true);
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } finally {
      setSigningOut(false);
    }
  };

  const nav = (
    <nav className="flex flex-col gap-1">
      {LINKS.map((link) => {
        const Icon = link.icon;
        const active = isActive(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className={cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium transition',
              active ? 'bg-forest text-white' : 'text-mute hover:bg-soft hover:text-ink'
            )}
          >
            <Icon className="h-[17px] w-[17px]" strokeWidth={1.8} />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-line bg-white lg:flex">
        <div className="border-b border-line px-5 py-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-forest font-display text-[14px] font-semibold text-white">
              H
            </span>
            <span>
              <span className="block font-display text-[15px] font-semibold leading-none tracking-[-0.02em] text-ink">
                Hamubere
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.14em] text-mute">
                Admin panel
              </span>
            </span>
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">{nav}</div>

        <div className="border-t border-line p-3">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-mute transition hover:bg-soft hover:text-ink"
          >
            View site
            <ExternalLink className="h-3.5 w-3.5" />
          </Link>
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-[13px] font-medium text-mute transition hover:bg-soft hover:text-ink"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign out'}
            <LogOut className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      <div className="sticky top-0 z-40 border-b border-line bg-white lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-forest font-display text-[13px] font-semibold text-white">
              H
            </span>
            <span className="text-[14px] font-semibold text-ink">Hamubere admin</span>
          </Link>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              aria-label="View site"
              className="grid h-9 w-9 place-items-center rounded-full text-mute hover:bg-soft"
            >
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-label={open ? 'Close admin menu' : 'Open admin menu'}
              className="grid h-9 w-9 place-items-center rounded-full text-ink hover:bg-soft"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {open ? (
          <div className="border-t border-line px-3 py-3">
            {nav}
            <button
              type="button"
              onClick={signOut}
              className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-medium text-mute hover:bg-soft hover:text-ink"
            >
              <LogOut className="h-[17px] w-[17px]" strokeWidth={1.8} />
              Sign out
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}
