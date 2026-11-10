export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

export function rwf(value: number) {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(value) + ' RWF';
}

export function todayISO() {
  return toISO(new Date());
}

export function toISO(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseISO(value: string | undefined | null) {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const date = new Date(value + 'T12:00:00');
  return Number.isNaN(date.getTime()) ? null : date;
}

export function addDays(value: string | Date, days: number) {
  const base = typeof value === 'string' ? parseISO(value) : value;
  const start = base ? new Date(base) : new Date();
  start.setDate(start.getDate() + days);
  return toISO(start);
}

export function nightsBetween(checkIn: string, checkOut: string) {
  const a = parseISO(checkIn);
  const b = parseISO(checkOut);
  if (!a || !b) return 0;
  return Math.round((b.getTime() - a.getTime()) / 86400000);
}

export function formatDay(value: string | undefined | null) {
  const date = parseISO(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export function formatLongDay(value: string | undefined | null) {
  const date = parseISO(value);
  if (!date) return '';
  return date.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long' });
}

export function formatRange(from: string | undefined | null, to: string | undefined | null) {
  const a = formatDay(from);
  const b = formatDay(to);
  if (!a || !b) return '';
  return `${a} – ${b}`;
}

export function firstParam(
  value: string | string[] | undefined
): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export function bookingRef(seed: string) {
  let hash = 7;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) % 99991;
  }
  return 'HAM-' + String(1000 + (hash % 9000));
}

export function plural(count: number, singular: string, pluralWord?: string) {
  return count === 1 ? singular : pluralWord || singular + 's';
}
