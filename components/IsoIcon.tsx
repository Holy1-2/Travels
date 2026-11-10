const CATEGORY_ICONS: Record<string, string> = {
  all: '<path d="M32 6L56 19L32 32L8 19Z" fill="url(#gT)"/><path d="M8 19L32 32V58L8 45Z" fill="url(#gL)"/><path d="M56 19L32 32V58L56 45Z" fill="url(#gR)"/><path d="M32 32L56 19" stroke="url(#gG)" stroke-width="2"/><circle cx="32" cy="19" r="4" fill="url(#gG)"/>',
  hotels:
    '<path d="M32 3L50 12L32 21L14 12Z" fill="url(#gT)"/><path d="M14 12L32 21V60L14 51Z" fill="url(#gL)"/><path d="M50 12L32 21V60L50 51Z" fill="url(#gR)"/><g fill="url(#gG)"><path d="M19 27l8 4v5l-8-4zM19 40l8 4v5l-8-4zM37 31l8-4v5l-8 4zM37 44l8-4v5l-8 4z"/></g>',
  lodges:
    '<path d="M8 36L32 48V60L8 48Z" fill="url(#gL)"/><path d="M56 36L32 48V60L56 48Z" fill="url(#gR)"/><path d="M2 34L32 18L62 34L32 50Z" fill="url(#gG)"/><path d="M2 34L32 50V54L2 38Z" fill="#A8832F"/><path d="M62 34L32 50V54L62 38Z" fill="#8C6D22"/><path d="M26 22l6-3 6 3-6 3z" fill="#fff" opacity=".5"/>',
  camps:
    '<ellipse cx="32" cy="55" rx="26" ry="6" fill="#0F3D2E" opacity=".18"/><path d="M32 8L60 54H4Z" fill="url(#gL)"/><path d="M32 8L60 54H34Z" fill="url(#gR)"/><path d="M32 28L44 54H20Z" fill="url(#gT)"/><path d="M32 28L44 54H32Z" fill="#A9CDB8"/><path d="M32 8V2l8 3-8 3" fill="url(#gG)"/>',
  villas:
    '<path d="M6 34L30 46V58L6 46Z" fill="url(#gL)"/><path d="M54 34L30 46V58L54 46Z" fill="url(#gR)"/><path d="M2 32L30 16L58 32L30 46Z" fill="url(#gT)"/><path d="M12 31L30 8L48 31L30 42Z" fill="url(#gG)"/><path d="M12 31L30 42V47L12 36Z" fill="#A8832F"/><path d="M48 31L30 42V47L48 36Z" fill="#8C6D22"/><path d="M44 50l12-6 6 3-12 6z" fill="#5BC0C8"/>',
  guesthouses:
    '<ellipse cx="32" cy="57" rx="27" ry="5" fill="#0F3D2E" opacity=".15"/><path d="M8 30L28 40V56L8 46Z" fill="url(#gL)"/><path d="M48 30L28 40V56L48 46Z" fill="url(#gR)"/><path d="M4 30L28 18L52 30L28 42Z" fill="url(#gG)"/><path d="M52 40h4v16h-4z" fill="#6B4E2A"/><circle cx="54" cy="34" r="9" fill="#4F9A6A"/><circle cx="50" cy="38" r="6" fill="#2E7D5B"/><path d="M20 44l6 3v8l-6-3z" fill="#fff" opacity=".8"/>',
};

const FEATURE_ICONS: Record<string, string> = {
  pin: '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><path d="M24 4C15 4 9 10.5 9 18.5 9 29 24 42 24 42s15-13 15-23.5C39 10.5 33 4 24 4z" fill="url(#gL)"/><path d="M24 4C15 4 9 10.5 9 18.5c0 3 1 6 2.5 8.5C12 14 17 8 24 8z" fill="#fff" opacity=".35"/><circle cx="24" cy="18" r="6.5" fill="url(#rG)"/>',
  cal: '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><rect x="6" y="9" width="36" height="32" rx="7" fill="url(#gW)" stroke="#CFE0D6"/><path d="M6 16a7 7 0 0 1 7-7h22a7 7 0 0 1 7 7v5H6z" fill="url(#gL)"/><circle cx="14" cy="8" r="3.2" fill="url(#rG)"/><circle cx="34" cy="8" r="3.2" fill="url(#rG)"/><g fill="url(#gL)"><rect x="12" y="26" width="6" height="5" rx="1.5"/><rect x="21" y="26" width="6" height="5" rx="1.5"/><rect x="30" y="26" width="6" height="5" rx="1.5"/><rect x="12" y="34" width="6" height="4" rx="1.5"/></g><rect x="21" y="34" width="6" height="4" rx="1.5" fill="url(#gG)"/>',
  guest:
    '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><circle cx="17" cy="15" r="7" fill="url(#rL)"/><path d="M4 38c0-8 6-13 13-13s13 5 13 13z" fill="url(#gL)"/><circle cx="33" cy="17" r="6" fill="url(#rG)"/><path d="M24 38c0-6 4-10 10-10s10 4 10 10z" fill="url(#gG)"/>',
  compass:
    '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><circle cx="24" cy="23" r="18" fill="url(#gL)"/><circle cx="24" cy="23" r="18" fill="none" stroke="url(#gG)" stroke-width="3"/><circle cx="24" cy="23" r="13" fill="url(#gW)"/><path d="M31 16L26 26 17 30l5-10z" fill="url(#gG)"/><path d="M31 16L26 26 22 20z" fill="#8C6D22" opacity=".5"/><ellipse cx="17" cy="11" rx="8" ry="3.5" fill="#fff" opacity=".28" transform="rotate(-25 17 11)"/>',
  bed: '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><path d="M5 30h38v9H5z" fill="url(#gR)"/><path d="M5 24a4 4 0 0 1 4-4h30a4 4 0 0 1 4 4v6H5z" fill="url(#gW)" stroke="#CFE0D6"/><rect x="9" y="14" width="12" height="9" rx="3" fill="url(#gG)"/><path d="M5 39v4M43 39v4" stroke="#0F3D2E" stroke-width="3" stroke-linecap="round"/><path d="M5 12v27" stroke="url(#gL)" stroke-width="3.5" stroke-linecap="round"/>',
  star: '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><path d="M24 4l6 13 14 1.8-10.4 9.6 2.8 14L24 35.6 11.6 42.4l2.8-14L4 18.8 18 17z" fill="url(#gG)"/><path d="M24 4l6 13 14 1.8L24 24z" fill="#fff" opacity=".35"/><path d="M24 35.6l-12.4 6.8 2.8-14L24 24z" fill="#8C6D22" opacity=".35"/>',
  shield:
    '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><path d="M24 4l17 6v13c0 10-7 17-17 21C14 40 7 33 7 23V10z" fill="url(#gL)"/><path d="M24 4l17 6v13c0 10-7 17-17 21z" fill="url(#gR)"/><path d="M24 4L7 10v6c6-1 12-3 17-8z" fill="#fff" opacity=".3"/><path d="M16 24l6 6 11-12" fill="none" stroke="url(#gG)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>',
  card: '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><rect x="4" y="12" width="40" height="28" rx="7" fill="url(#gL)"/><path d="M4 22h40v-3a7 7 0 0 0-7-7H11a7 7 0 0 0-7 7z" fill="#fff" opacity=".22"/><rect x="4" y="24" width="40" height="6" fill="url(#gG)"/><rect x="9" y="34" width="12" height="3" rx="1.5" fill="#fff" opacity=".7"/>',
  mail:
    '<ellipse cx="24" cy="43.5" rx="11" ry="3" fill="#0F3D2E" opacity=".18"/><rect x="5" y="11" width="38" height="28" rx="6" fill="url(#gW)" stroke="#CFE0D6"/><path d="M7 15l17 13 17-13" fill="none" stroke="url(#gL)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>',
};

export type IsoCategoryName =
  | 'all'
  | 'hotels'
  | 'lodges'
  | 'camps'
  | 'villas'
  | 'guesthouses';

export type IsoFeatureName =
  | 'pin'
  | 'cal'
  | 'guest'
  | 'compass'
  | 'bed'
  | 'star'
  | 'shield'
  | 'card'
  | 'mail';

export type IsoName = IsoCategoryName | IsoFeatureName;

export default function IsoIcon({
  name,
  className = '',
}: {
  name: IsoName;
  className?: string;
}) {
  const isCategory = name in CATEGORY_ICONS;
  const body = isCategory ? CATEGORY_ICONS[name] : FEATURE_ICONS[name];

  return (
    <svg
      viewBox={isCategory ? '0 0 64 64' : '0 0 48 48'}
      className={className}
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <g dangerouslySetInnerHTML={{ __html: body }} />
    </svg>
  );
}
