export type BookingKind = 'stay' | 'experience';
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingPaymentStatus = 'unpaid' | 'processing' | 'paid' | 'failed' | 'refunded';
export type PaymentProvider = 'sandbox' | 'flutterwave';
export type PaymentMethod = 'card' | 'mtn' | 'airtel';
export type PaymentStatus = 'pending' | 'processing' | 'succeeded' | 'failed' | 'cancelled';

export interface BookingRow {
  reference: string;
  kind: BookingKind;
  item_slug: string;
  item_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  check_in: string;
  check_out: string | null;
  guests: number;
  nights: number;
  unit_price: number;
  subtotal: number;
  service_fee: number;
  total: number;
  currency: string;
  status: BookingStatus;
  payment_status: BookingPaymentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface PaymentRow {
  id: string;
  booking_reference: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  provider_reference: string | null;
  checkout_url: string | null;
  payer_phone: string | null;
  failure_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ListingRequestRow {
  id: string;
  property_name: string;
  property_type: string;
  region: string;
  rooms: number;
  contact_name: string;
  email: string;
  phone: string;
  notes: string;
  status: string;
  created_at: string;
}

export interface PublicPayment {
  id: string;
  provider: PaymentProvider;
  method: PaymentMethod;
  amount: number;
  currency: string;
  status: PaymentStatus;
  checkoutUrl: string | null;
  failureReason: string | null;
  createdAt: string;
}

export interface PublicBooking {
  reference: string;
  kind: BookingKind;
  itemSlug: string;
  itemName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  nights: number;
  unitPrice: number;
  subtotal: number;
  serviceFee: number;
  total: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  notes: string;
  createdAt: string;
  updatedAt: string;
  payments: PublicPayment[];
}

export interface PublicBookingSummary {
  reference: string;
  kind: BookingKind;
  itemSlug: string;
  itemName: string;
  checkIn: string;
  checkOut: string | null;
  guests: number;
  total: number;
  currency: string;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  createdAt: string;
}

export function toPublicPayment(row: PaymentRow): PublicPayment {
  return {
    id: row.id,
    provider: row.provider,
    method: row.method,
    amount: row.amount,
    currency: row.currency,
    status: row.status,
    checkoutUrl: row.checkout_url,
    failureReason: row.failure_reason,
    createdAt: row.created_at,
  };
}

export function toPublicBooking(row: BookingRow, payments: PaymentRow[] = []): PublicBooking {
  return {
    reference: row.reference,
    kind: row.kind,
    itemSlug: row.item_slug,
    itemName: row.item_name,
    guestName: row.guest_name,
    guestEmail: row.guest_email,
    guestPhone: row.guest_phone,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    nights: row.nights,
    unitPrice: row.unit_price,
    subtotal: row.subtotal,
    serviceFee: row.service_fee,
    total: row.total,
    currency: row.currency,
    status: row.status,
    paymentStatus: row.payment_status,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    payments: payments.map(toPublicPayment),
  };
}

export function toPublicBookingSummary(row: BookingRow): PublicBookingSummary {
  return {
    reference: row.reference,
    kind: row.kind,
    itemSlug: row.item_slug,
    itemName: row.item_name,
    checkIn: row.check_in,
    checkOut: row.check_out,
    guests: row.guests,
    total: row.total,
    currency: row.currency,
    status: row.status,
    paymentStatus: row.payment_status,
    createdAt: row.created_at,
  };
}
