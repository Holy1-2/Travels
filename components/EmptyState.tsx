import Image from 'next/image';
import Link from 'next/link';
import IsoIcon from './IsoIcon';

export default function EmptyState({
  title,
  message,
  action,
  art = '/images/art/hills-soft.jpg',
  icon = 'compass',
}: {
  title: string;
  message: string;
  action?: { href: string; label: string };
  art?: string;
  icon?: 'compass' | 'bed' | 'star' | 'shield' | 'pin';
}) {
  return (
    <div className="mx-auto max-w-xl overflow-hidden rounded-[32px] border border-line bg-white p-8 text-center shadow-soft sm:p-12">
      <div className="relative mx-auto h-40 w-40 overflow-hidden rounded-[46%_54%_50%_50%/50%_46%_54%_50%]">
        <Image src={art} alt="" fill sizes="160px" className="object-cover" />
        <div className="absolute inset-0 bg-forest/10" />
      </div>
      <IsoIcon name={icon} className="mx-auto -mt-9 h-16 w-16 drop-shadow-[0_10px_8px_rgba(15,61,46,0.28)]" />
      <h3 className="mt-4 font-serif text-2xl text-forest">{title}</h3>
      <p className="mx-auto mt-2 max-w-sm text-[15px] leading-relaxed text-mute">{message}</p>
      {action ? (
        <Link href={action.href} className="btn-primary mt-6">
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}
