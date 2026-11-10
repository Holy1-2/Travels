import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="wrap flex min-h-[62vh] items-center justify-center py-16">
      <div className="max-w-xl text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-soft text-forest">
          <Compass className="h-6 w-6" strokeWidth={1.6} />
        </span>
        <p className="eyebrow mt-6 justify-center">404</p>
        <h1 className="mt-3 text-balance font-display text-[clamp(32px,4.8vw,48px)] font-semibold leading-[1.04] tracking-[-0.04em] text-ink">
          This path leads <span className="text-forest">somewhere else.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-mute">
          The page you were looking for has moved or no longer exists. The hills are still here —
          start with the stays.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <Link href="/stays" className="btn-primary">
            Browse stays
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/" className="btn-outline">
            Back home
          </Link>
        </div>
      </div>
    </div>
  );
}
