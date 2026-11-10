export default function SectionHeader({
  eyebrow,
  title,
  subtitle,
  action,
  align = 'left',
}: {
  eyebrow?: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  action?: React.ReactNode;
  align?: 'left' | 'center';
}) {
  return (
    <div
      className={`flex flex-wrap items-end justify-between gap-6 ${
        align === 'center' ? 'flex-col items-center text-center' : ''
      }`}
    >
      <div className="max-w-2xl">
        {eyebrow ? <p className="eyebrow mb-3">{eyebrow}</p> : null}
        <h2 className="text-balance font-display text-[clamp(28px,3.4vw,42px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
          {title}
        </h2>
        {subtitle ? (
          <p className="mt-3.5 max-w-xl text-[15px] leading-relaxed text-mute">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}
