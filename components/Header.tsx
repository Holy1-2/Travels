'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight, Heart, Menu, X } from 'lucide-react';
import Logo from './Logo';
import { useFavorites } from './FavoritesProvider';
import { cn } from '@/lib/utils';

const NAV: { href: string; label: string }[] = [
  { href: '/destinations', label: 'Destinations' },
  { href: '/stays', label: 'Stays' },
  { href: '/experiences', label: 'Experiences' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const pathname = usePathname();
  const { favorites, ready } = useFavorites();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b bg-white/95 backdrop-blur-xl transition-all duration-300',
        scrolled ? 'border-line shadow-[0_10px_30px_-24px_rgba(27,27,25,0.4)]' : 'border-transparent'
      )}
    >
      <div className="wrap">
        <div className="flex h-[74px] items-center justify-between gap-4">
          <Logo />

          <nav aria-label="Main navigation" className="hidden items-center gap-0.5 lg:flex">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'relative rounded-full px-3.5 py-2 text-[14px] font-medium transition duration-200',
                    active ? 'text-ink' : 'text-mute hover:bg-soft hover:text-ink'
                  )}
                >
                  {item.label}
                  <span
                    className={cn(
                      'absolute inset-x-3.5 -bottom-0.5 h-[2px] rounded-full bg-ink transition duration-300',
                      active ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1">
            <Link
              href="/list-property"
              className="hidden rounded-full px-3.5 py-2 text-[13.5px] font-medium text-mute transition hover:bg-soft hover:text-ink xl:inline-flex"
            >
              List your property
            </Link>

            <span className="mx-1.5 hidden h-5 w-px bg-line xl:block" aria-hidden="true" />

            <Link
              href="/favorites"
              aria-label={`Saved stays${ready && favorites.length ? ` (${favorites.length})` : ''}`}
              className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-soft"
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.8} />
              {ready && favorites.length > 0 && (
                <span className="absolute right-1 top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-gold px-1 text-[9px] font-bold text-white">
                  {favorites.length}
                </span>
              )}
            </Link>

            <Link
              href="/stays"
              className="btn-primary ml-1 hidden !px-4 !py-2.5 sm:inline-flex"
            >
              Book a stay
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="ml-1 grid h-10 w-10 place-items-center rounded-full text-ink transition hover:bg-soft lg:hidden"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="wrap flex flex-col py-3">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center justify-between border-b border-line/70 py-3.5 text-[16px] font-medium transition',
                    isActive(item.href) ? 'text-ink' : 'text-mute hover:text-ink'
                  )}
                >
                  {item.label}
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </Link>
              ))}
              <Link
                href="/list-property"
                className="flex items-center justify-between border-b border-line/70 py-3.5 text-[16px] font-medium text-mute transition hover:text-ink"
              >
                List your property
                <ArrowUpRight className="h-4 w-4 opacity-40" />
              </Link>
              <div className="mt-4 grid grid-cols-2 gap-2.5 pb-2">
                <Link href="/favorites" className="btn-outline !py-3">
                  <Heart className="h-4 w-4" />
                  Saved {favorites.length ? `(${favorites.length})` : ''}
                </Link>
                <Link href="/stays" className="btn-primary !py-3">
                  Book a stay
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
