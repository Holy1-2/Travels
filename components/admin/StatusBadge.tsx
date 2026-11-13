import { cn } from '@/lib/utils';

type Tone = 'forest' | 'gold' | 'clay' | 'mute' | 'ink';

const TONES: Record<Tone, string> = {
  forest: 'border-forest/25 bg-forest/[0.07] text-forest',
  gold: 'border-gold/30 bg-gold/[0.08] text-ink',
  clay: 'border-clay/30 bg-clay/[0.07] text-clay',
  mute: 'border-line bg-soft text-mute',
  ink: 'border-ink/15 bg-white text-ink',
};

const TONE_BY_VALUE: Record<string, Tone> = {
  paid: 'forest',
  confirmed: 'forest',
  succeeded: 'forest',
  approved: 'forest',
  completed: 'ink',
  refunded: 'ink',
  processing: 'gold',
  pending: 'gold',
  reviewing: 'gold',
  new: 'gold',
  unpaid: 'mute',
  cancelled: 'clay',
  failed: 'clay',
  declined: 'clay',
};

export default function StatusBadge({
  value,
  className,
}: {
  value: string;
  className?: string;
}) {
  const tone = TONE_BY_VALUE[value.toLowerCase()] ?? 'mute';

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-[10.5px] font-semibold capitalize tracking-wide',
        TONES[tone],
        className
      )}
    >
      {value}
    </span>
  );
}
