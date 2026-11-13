import type { PoolConnection } from 'mysql2/promise';
import { minutesAgoISO, nowISO, query, queryOne, transaction } from './db';
import { ApiError } from './http';
import { quoteBooking, type Quote } from './pricing';
import { bookingReference } from './references';
import type {
  BookingKind,
  BookingRow,
  BookingStatus,
  PaymentRow,
  PublicBooking,
  PublicBookingSummary,
} from './types';
import { toPublicBooking, toPublicBookingSummary } from './types';

// An unpaid booking holds dates for this long, then the dates free up again.
export const HOLD_MINUTES = 30;

type Conn = PoolConnection;

async function referenceExists(reference: string, connection?: Conn) {
  if (connection) {
    const [rows] = await connection.query('SELECT 1 FROM bookings WHERE reference = ?', [
      reference,
    ]);
    return (rows as unknown[]).length > 0;
  }
  return Boolean(await queryOne('SELECT 1 FROM bookings WHERE reference = ?', [reference]));
}

async function uniqueBookingReference(connection?: Conn) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const reference = bookingReference();
    if (!(await referenceExists(reference, connection))) return reference;
  }
  return `HAM-${bookingReference().slice(4)}X`;
}

export async function getBookingRow(reference: string) {
  return queryOne<BookingRow>('SELECT * FROM bookings WHERE reference = ?', [
    reference.toUpperCase(),
  ]);
}

export async function getPaymentsForBooking(reference: string): Promise<PaymentRow[]> {
  return query<PaymentRow>(
    'SELECT * FROM payments WHERE booking_reference = ? ORDER BY created_at DESC',
    [reference.toUpperCase()]
  );
}

export async function getBooking(reference: string): Promise<PublicBooking | null> {
  const row = await getBookingRow(reference);
  if (!row) return null;
  return toPublicBooking(row, await getPaymentsForBooking(row.reference));
}

export async function recordEvent(
  reference: string,
  type: string,
  detail?: string,
  connection?: Conn
) {
  if (connection) {
    await connection.query(
      'INSERT INTO booking_events (booking_reference, type, detail, created_at) VALUES (?, ?, ?, ?)',
      [reference, type, detail ?? null, nowISO()]
    );
    return;
  }
  await query('INSERT INTO booking_events (booking_reference, type, detail, created_at) VALUES (?, ?, ?, ?)', [
    reference,
    type,
    detail ?? null,
    nowISO(),
  ]);
}

interface HeldRow {
  reference: string;
  check_in: string;
  check_out: string | null;
  guests: number;
  status: BookingStatus;
  payment_status: string;
  created_at: string;
}

async function heldRows(kind: BookingKind, slug: string, connection?: Conn) {
  const sql = `SELECT reference, check_in, check_out, guests, status, payment_status, created_at
       FROM bookings
       WHERE kind = ? AND item_slug = ? AND status IN ('pending', 'confirmed')`;

  const rows = connection
    ? ((await connection.query(sql, [kind, slug]))[0] as HeldRow[])
    : await query<HeldRow>(sql, [kind, slug]);

  const cutoff = minutesAgoISO(HOLD_MINUTES);

  return rows.filter(
    (row) =>
      row.status === 'confirmed' ||
      row.payment_status === 'paid' ||
      row.payment_status === 'processing' ||
      row.created_at >= cutoff
  );
}

async function assertStayAvailable(
  slug: string,
  checkIn: string,
  checkOut: string,
  connection?: Conn
) {
  const conflict = (await heldRows('stay', slug, connection)).find(
    (row) => row.check_in < checkOut && (row.check_out ?? row.check_in) > checkIn
  );

  if (conflict) {
    throw new ApiError(
      409,
      'Those dates were just taken. Please choose another check-in or check-out date.',
      'dates_unavailable'
    );
  }
}

async function assertExperienceAvailable(
  slug: string,
  date: string,
  guests: number,
  connection?: Conn
) {
  const bookedGuests = (await heldRows('experience', slug, connection))
    .filter((row) => row.check_in === date)
    .reduce((total, row) => total + Number(row.guests), 0);

  // Experiences are small-group; leave headroom for other guests on the date.
  if (bookedGuests + guests > 20) {
    throw new ApiError(
      409,
      'That date is fully booked for this experience. Please choose another date.',
      'date_unavailable'
    );
  }
}

export interface CreateBookingInput {
  kind: BookingKind;
  slug: string;
  checkIn: string;
  checkOut?: string | null;
  guests: number;
  guest: { name: string; email: string; phone: string };
  notes?: string;
}

const INSERT_BOOKING = `
  INSERT INTO bookings (
    reference, kind, item_slug, item_name, guest_name, guest_email, guest_phone,
    check_in, check_out, guests, nights, unit_price, subtotal, service_fee, total,
    currency, status, payment_status, notes, created_at, updated_at
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', 'unpaid', ?, ?, ?)
`;

export async function createBooking(input: CreateBookingInput): Promise<PublicBooking> {
  const quote: Quote = await quoteBooking({
    kind: input.kind,
    slug: input.slug,
    guests: input.guests,
    checkIn: input.checkIn,
    checkOut: input.checkOut,
  });

  const reference = await transaction(async (connection) => {
    if (quote.kind === 'stay') {
      await assertStayAvailable(quote.slug, quote.checkIn, quote.checkOut!, connection);
    } else {
      await assertExperienceAvailable(quote.slug, quote.checkIn, quote.guests, connection);
    }

    const reference = await uniqueBookingReference(connection);
    const timestamp = nowISO();

    await connection.query(INSERT_BOOKING, [
      reference,
      quote.kind,
      quote.slug,
      quote.name,
      input.guest.name,
      input.guest.email.toLowerCase(),
      input.guest.phone,
      quote.checkIn,
      quote.checkOut,
      quote.guests,
      quote.nights,
      quote.unitPrice,
      quote.subtotal,
      quote.serviceFee,
      quote.total,
      quote.currency,
      input.notes ?? '',
      timestamp,
      timestamp,
    ]);

    await recordEvent(reference, 'booking_created', `${quote.kind}:${quote.slug}`, connection);
    return reference;
  });

  return (await getBooking(reference))!;
}

export async function setBookingStatus(
  reference: string,
  status: BookingStatus,
  paymentStatus?: BookingRow['payment_status'],
  connection?: Conn
) {
  const timestamp = nowISO();
  const sql = paymentStatus
    ? 'UPDATE bookings SET status = ?, payment_status = ?, updated_at = ? WHERE reference = ?'
    : 'UPDATE bookings SET status = ?, updated_at = ? WHERE reference = ?';
  const params = paymentStatus
    ? [status, paymentStatus, timestamp, reference.toUpperCase()]
    : [status, timestamp, reference.toUpperCase()];

  if (connection) {
    await connection.query(sql, params);
    return;
  }
  await query(sql, params);
}

export async function markBookingPaid(reference: string, connection?: Conn) {
  await setBookingStatus(reference, 'confirmed', 'paid', connection);
  await recordEvent(reference, 'payment_confirmed', undefined, connection);
}

export async function markBookingPaymentFailed(reference: string, connection?: Conn) {
  const timestamp = nowISO();
  const sql = `UPDATE bookings
     SET payment_status = 'failed', status = 'pending', updated_at = ?
     WHERE reference = ? AND payment_status != 'paid'`;
  if (connection) {
    await connection.query(sql, [timestamp, reference.toUpperCase()]);
  } else {
    await query(sql, [timestamp, reference.toUpperCase()]);
  }
  await recordEvent(reference, 'payment_failed', undefined, connection);
}

export async function cancelBooking(reference: string, email?: string): Promise<PublicBooking> {
  const row = await getBookingRow(reference);
  if (!row) throw new ApiError(404, 'Booking not found.', 'not_found');

  if (email && row.guest_email.toLowerCase() !== email.toLowerCase()) {
    throw new ApiError(403, 'That email does not match this booking.', 'forbidden');
  }
  if (row.payment_status === 'paid') {
    throw new ApiError(
      409,
      'This booking is already paid. Contact hello@hamubere.com and we will help with a change or refund.',
      'paid_booking'
    );
  }
  if (row.status === 'cancelled') return (await getBooking(reference))!;

  await transaction(async (connection) => {
    await connection.query(
      `UPDATE payments SET status = 'cancelled', updated_at = ?
       WHERE booking_reference = ? AND status IN ('pending', 'processing')`,
      [nowISO(), row.reference]
    );
    await setBookingStatus(row.reference, 'cancelled', 'unpaid', connection);
    await recordEvent(row.reference, 'booking_cancelled', 'guest_cancelled', connection);
  });

  return (await getBooking(reference))!;
}

export async function findBookingByReferenceAndEmail(reference: string, email: string) {
  const row = await getBookingRow(reference);
  if (!row) return null;
  if (row.guest_email.toLowerCase() !== email.toLowerCase()) return null;
  return toPublicBooking(row, await getPaymentsForBooking(row.reference));
}

export async function listBookings(limit = 50, offset = 0) {
  const rows = await query<BookingRow>(
    'SELECT * FROM bookings ORDER BY created_at DESC LIMIT ? OFFSET ?',
    [Math.min(limit, 200), Math.max(offset, 0)]
  );
  return rows.map(toPublicBookingSummary);
}

export async function bookedStayRanges(slug: string) {
  return (await heldRows('stay', slug))
    .map((row) => ({ checkIn: row.check_in, checkOut: row.check_out }))
    .filter((range): range is { checkIn: string; checkOut: string } => Boolean(range.checkOut));
}

export async function bookedExperienceDates(slug: string, from: string, to: string) {
  return (await heldRows('experience', slug))
    .filter((row) => row.check_in >= from && row.check_in <= to)
    .map((row) => row.check_in);
}

export async function getBookingSummaryList(): Promise<PublicBookingSummary[]> {
  return listBookings();
}

export interface AdminBookingUpdate {
  status?: BookingStatus;
  paymentStatus?: BookingRow['payment_status'];
  note?: string;
}

export async function adminUpdateBooking(
  reference: string,
  update: AdminBookingUpdate
): Promise<PublicBooking> {
  const row = await getBookingRow(reference);
  if (!row) throw new ApiError(404, 'Booking not found.', 'not_found');

  await transaction(async (connection) => {
    if (update.status) {
      await connection.query('UPDATE bookings SET status = ?, updated_at = ? WHERE reference = ?', [
        update.status,
        nowISO(),
        row.reference,
      ]);
    }
    if (update.paymentStatus) {
      await connection.query(
        'UPDATE bookings SET payment_status = ?, updated_at = ? WHERE reference = ?',
        [update.paymentStatus, nowISO(), row.reference]
      );
    }
    await recordEvent(
      row.reference,
      'admin_update',
      [
        update.status && `status:${update.status}`,
        update.paymentStatus && `payment:${update.paymentStatus}`,
        update.note,
      ]
        .filter(Boolean)
        .join(' · '),
      connection
    );
  });

  return (await getBooking(row.reference))!;
}

export async function getBookingEvents(reference: string) {
  return query<{
    type: string;
    detail: string | null;
    created_at: string;
  }>(
    'SELECT type, detail, created_at FROM booking_events WHERE booking_reference = ? ORDER BY created_at DESC',
    [reference.toUpperCase()]
  );
}

export async function getBookingStats() {
  const totals = await queryOne<{
    bookings: number | string;
    paid: number | string;
    open: number | string;
    cancelled: number | string;
    revenue: number | string;
    revenue30: number | string;
  }>(
    `SELECT
        COUNT(*) as bookings,
        SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) as paid,
        SUM(CASE WHEN payment_status IN ('unpaid', 'processing') THEN 1 ELSE 0 END) as open,
        SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' THEN total ELSE 0 END), 0) as revenue,
        COALESCE(SUM(CASE WHEN payment_status = 'paid' AND created_at >= ? THEN total ELSE 0 END), 0) as revenue30
       FROM bookings`,
    [minutesAgoISO(60 * 24 * 30)]
  );

  const recent = await query<BookingRow>('SELECT * FROM bookings ORDER BY created_at DESC LIMIT 8');

  return {
    bookings: Number(totals?.bookings ?? 0),
    paid: Number(totals?.paid ?? 0),
    open: Number(totals?.open ?? 0),
    cancelled: Number(totals?.cancelled ?? 0),
    revenue: Number(totals?.revenue ?? 0),
    revenue30: Number(totals?.revenue30 ?? 0),
    recent: recent.map(toPublicBookingSummary),
  };
}
