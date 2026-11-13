export default function AdminPageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow ? (
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-mute">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1.5 font-display text-[clamp(26px,3.4vw,34px)] font-semibold leading-[1.08] tracking-[-0.035em] text-ink">
          {title}
        </h1>
        {description ? (
          <p className="mt-1.5 max-w-2xl text-[13.5px] leading-relaxed text-mute">{description}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
