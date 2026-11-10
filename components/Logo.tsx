import Link from 'next/link';

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="Hamubere Travels home"
    >
      <svg
        width="36"
        height="36"
        viewBox="0 0 40 40"
        aria-hidden="true"
        className="shrink-0 transition duration-500 ease-smooth group-hover:-rotate-6"
      >
        <circle cx="20" cy="20" r="19" fill={light ? '#10382D' : '#15473A'} />
        <path d="M5 28l9-12 5 7 4-5 12 10z" fill="#D9B98F" />
        <circle cx="27" cy="12" r="3.5" fill="#F0D9BF" />
        {light ? null : (
          <circle cx="20" cy="20" r="19" fill="none" stroke="#D9B98F" strokeOpacity="0.22" />
        )}
      </svg>
      <span
        className={`font-display text-[20px] font-extrabold leading-none tracking-[-0.02em] ${
          light ? 'text-white' : 'text-ink'
        }`}
      >
        Hamubere
        <small className="mt-1 block font-sans text-[8.5px] font-semibold uppercase tracking-[0.26em] text-gold">
          Travels
        </small>
      </span>
    </Link>
  );
}
