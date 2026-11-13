import { getExperienceBySlug, getStayBySlug } from './content';
import { nightsBetween, parseISO } from '@/lib/utils';
import type { BookingKind } from './types';

export const STAY_SERVICE_RATE = 0.05;
export const EXPERIENCE_SERVICE_RATE = 0.03;
export const MAX_EXPERIENCE_GUESTS = 10;
export const MAX_STAY_NIGHTS = 30;
export const MAX_EXPERIENCE_CAPACITY_PER_DAY = 20;

export class QuoteError extends Error {
  status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = 'QuoteError';
    this.status = status;
  }
}

export interface QuoteInput {
  kind: BookingKind;
  slug: string;
  guests: number;
  checkIn: string;
  checkOut?: string | null;
}

export interface Quote {
  kind: BookingKind;
  slug: string;
  name: string;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  nights: number;
  unitPrice: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: 'RWF';
}

function isPast(date: string) {
  const parsed = parseISO(date);
  if (!parsed) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return parsed.getTime() < today.getTime();
}

export async function quoteBooking(input: QuoteInput): Promise<Quote> {
  if (!Number.isInteger(input.guests) || input.guests < 1) {
    throw new QuoteError('Choose at least one guest.');
  }

  if (input.kind === 'stay') {
    const stay = await getStayBySlug(input.slug);
    if (!stay) throw new QuoteError('That stay could not be found.', 404);

    if (!parseISO(input.checkIn) || !parseISO(input.checkOut ?? '')) {
      throw new QuoteError('Choose a valid check-in and check-out date.');
    }
    if (isPast(input.checkIn)) {
      throw new QuoteError('Check-in cannot be in the past.');
    }

    const nights = nightsBetween(input.checkIn, input.checkOut ?? '');
    if (nights < 1) {
      throw new QuoteError('Check-out needs to be after check-in.');
    }
    if (nights > MAX_STAY_NIGHTS) {
      throw new QuoteError(`Stays are limited to ${MAX_STAY_NIGHTS} nights per booking.`);
    }
    if (input.guests > stay.capacity) {
      throw new QuoteError(`${stay.name} sleeps up to ${stay.capacity} guests.`);
    }

    const subtotal = stay.price * nights;
    const serviceFee = Math.round(subtotal * STAY_SERVICE_RATE);

    return {
      kind: 'stay',
      slug: stay.slug,
      name: stay.name,
      checkIn: input.checkIn,
      checkOut: input.checkOut ?? null,
      guests: input.guests,
      nights,
      unitPrice: stay.price,
      subtotal,
      serviceFee,
      total: subtotal + serviceFee,
      currency: 'RWF',
    };
  }

  const experience = await getExperienceBySlug(input.slug);
  if (!experience) throw new QuoteError('That experience could not be found.', 404);

  if (!parseISO(input.checkIn)) {
    throw new QuoteError('Choose a valid date for your experience.');
  }
  if (isPast(input.checkIn)) {
    throw new QuoteError('Choose a date in the future.');
  }
  if (input.guests > MAX_EXPERIENCE_GUESTS) {
    throw new QuoteError(`Experiences are limited to ${MAX_EXPERIENCE_GUESTS} guests per booking.`);
  }

  const subtotal = experience.price * input.guests;
  const serviceFee = Math.round(subtotal * EXPERIENCE_SERVICE_RATE);

  return {
    kind: 'experience',
    slug: experience.slug,
    name: experience.name,
    checkIn: input.checkIn,
    checkOut: null,
    guests: input.guests,
    nights: 0,
    unitPrice: experience.price,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
    currency: 'RWF',
  };
}
