import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import CheckoutFlow, { type CheckoutItem } from '@/components/CheckoutFlow';
import { getBooking } from '@/lib/server/bookings';
import { getExperienceBySlug, getStayBySlug } from '@/lib/server/content';
import { paymentMode } from '@/lib/server/payments';
import { addDays, firstParam, nightsBetween, parseISO, todayISO } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Complete your Hamubere Travels booking securely in the app.',
  robots: { index: false, follow: false },
};

function defaultCheckIn() {
  return addDays(todayISO(), 7);
}

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const reference = firstParam(params.reference);

  if (reference) {
    const booking = getBooking(reference);
    if (!booking) notFound();
    if (booking.paymentStatus === 'paid') redirect(`/bookings/${booking.reference}`);
    if (booking.status === 'cancelled') redirect(`/bookings/${booking.reference}`);

    const stay = booking.kind === 'stay' ? getStayBySlug(booking.itemSlug) : undefined;
    const experience =
      booking.kind === 'experience' ? getExperienceBySlug(booking.itemSlug) : undefined;
    const source = stay ?? experience;

    const item: CheckoutItem = {
      kind: booking.kind,
      slug: booking.itemSlug,
      name: booking.itemName,
      location: stay?.location ?? experience?.meetingPoint ?? 'Rwanda',
      image: stay?.images[0] ?? experience?.image ?? '/images/hero/hero-tea.jpg',
      unitPrice: booking.unitPrice,
      capacity: stay?.capacity ?? 10,
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guests: booking.guests,
      nights: booking.nights,
      duration: source && 'duration' in source ? source.duration : undefined,
    };

    return <CheckoutFlow item={item} booking={booking} sandbox={paymentMode() === 'sandbox'} />;
  }

  const kind = firstParam(params.kind) === 'experience' ? 'experience' : 'stay';
  const slug = firstParam(params.slug) ?? '';

  if (kind === 'stay') {
    const stay = getStayBySlug(slug);
    if (!stay) notFound();

    const fallbackIn = defaultCheckIn();
    const candidateIn = firstParam(params.checkin);
    const checkIn = parseISO(candidateIn) ? candidateIn! : fallbackIn;
    const candidateOut = firstParam(params.checkout);
    const checkOut =
      parseISO(candidateOut) && nightsBetween(checkIn, candidateOut!) > 0
        ? candidateOut!
        : addDays(checkIn, 2);
    const guests = Math.max(
      1,
      Math.min(Number(firstParam(params.guests)) || 2, stay.capacity, 6)
    );

    const item: CheckoutItem = {
      kind: 'stay',
      slug: stay.slug,
      name: stay.name,
      location: stay.location,
      image: stay.images[0],
      unitPrice: stay.price,
      capacity: stay.capacity,
      checkIn,
      checkOut,
      guests,
      nights: nightsBetween(checkIn, checkOut),
    };

    return <CheckoutFlow item={item} sandbox={paymentMode() === 'sandbox'} />;
  }

  const experience = getExperienceBySlug(slug);
  if (!experience) notFound();

  const candidateDate = firstParam(params.date);
  const date = parseISO(candidateDate) ? candidateDate! : defaultCheckIn();
  const guests = Math.max(1, Math.min(Number(firstParam(params.guests)) || 2, 10));

  const item: CheckoutItem = {
    kind: 'experience',
    slug: experience.slug,
    name: experience.name,
    location: experience.meetingPoint,
    image: experience.image,
    unitPrice: experience.price,
    capacity: 10,
    checkIn: date,
    checkOut: null,
    guests,
    nights: 0,
    duration: experience.duration,
  };

  return <CheckoutFlow item={item} sandbox={paymentMode() === 'sandbox'} />;
}
