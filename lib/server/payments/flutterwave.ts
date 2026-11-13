import { siteUrl } from '../site-url';

const API_BASE = 'https://api.flutterwave.com/v3';

export interface FlutterwaveCustomer {
  email: string;
  name: string;
  phone?: string;
}

export interface CardCheckoutInput {
  txRef: string;
  amount: number;
  currency: string;
  customer: FlutterwaveCustomer;
  description: string;
  meta?: Record<string, unknown>;
}

export interface MobileMoneyInput {
  txRef: string;
  amount: number;
  currency: string;
  network: 'MTN' | 'AIRTEL';
  phone: string;
  email: string;
  name: string;
  meta?: Record<string, unknown>;
}

export interface VerifiedTransaction {
  id: number | string;
  txRef: string;
  status: string;
  amount: number;
  currency: string;
  paymentType?: string;
  customer?: { email?: string; name?: string; phone_number?: string };
}

export function flutterwaveKey() {
  return process.env.FLUTTERWAVE_SECRET_KEY?.trim() || '';
}

export function isFlutterwaveConfigured() {
  return Boolean(flutterwaveKey());
}

export function paymentsAreSandbox() {
  if (process.env.PAYMENTS_SANDBOX === 'true') return true;
  if (process.env.PAYMENTS_SANDBOX === 'false') return false;
  return !isFlutterwaveConfigured();
}

export class FlutterwaveError extends Error {
  status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = 'FlutterwaveError';
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const key = flutterwaveKey();
  if (!key) throw new FlutterwaveError('Flutterwave is not configured.', 503);

  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    cache: 'no-store',
  });

  const payload = (await response.json().catch(() => null)) as
    | { status?: string; message?: string; data?: unknown }
    | null;

  if (!response.ok || !payload || payload.status === 'error') {
    throw new FlutterwaveError(
      payload?.message || `Flutterwave request failed (${response.status}).`,
      response.status === 401 ? 502 : response.status
    );
  }

  return payload as T;
}

export async function createCardCheckout(input: CardCheckoutInput) {
  const payload = await request<{ status: string; data: { link: string } }>('/payments', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: input.currency,
      redirect_url: `${siteUrl()}/api/payments/callback`,
      payment_options: 'card',
      customer: {
        email: input.customer.email,
        name: input.customer.name,
        phonenumber: input.customer.phone,
      },
      customizations: {
        title: 'Hamubere Travels',
        description: input.description,
        logo_url: `${siteUrl()}/icon.svg`,
      },
      meta: { ...input.meta, booking: input.meta?.booking },
    }),
  });

  if (!payload.data?.link) {
    throw new FlutterwaveError('Flutterwave did not return a checkout link.');
  }

  return payload.data.link;
}

export async function chargeMobileMoney(input: MobileMoneyInput) {
  const payload = await request<{
    status: string;
    data: {
      id?: number | string;
      status?: string;
      flw_ref?: string;
      meta?: { authorization?: { redirect?: string; mode?: string } };
    };
  }>('/charges?type=mobile_money_rwanda', {
    method: 'POST',
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: input.currency,
      network: input.network,
      phone_number: input.phone,
      email: input.email,
      fullname: input.name,
      meta: input.meta,
    }),
  });

  return {
    providerReference: String(payload.data?.flw_ref || payload.data?.id || ''),
    providerStatus: payload.data?.status || 'pending',
    redirect: payload.data?.meta?.authorization?.redirect ?? null,
  };
}

export async function verifyTransaction(transactionId: string | number): Promise<VerifiedTransaction> {
  const payload = await request<{
    status: string;
    data: {
      id: number | string;
      tx_ref: string;
      status: string;
      amount: number;
      currency: string;
      payment_type?: string;
      customer?: { email?: string; name?: string; phone_number?: string };
    };
  }>(`/transactions/${encodeURIComponent(String(transactionId))}/verify`);

  const data = payload.data;
  if (!data) throw new FlutterwaveError('Transaction could not be verified.');

  return {
    id: data.id,
    txRef: data.tx_ref,
    status: data.status,
    amount: Number(data.amount),
    currency: data.currency,
    paymentType: data.payment_type,
    customer: data.customer,
  };
}

export function validWebhookHash(hash: string | null) {
  const expected = process.env.FLUTTERWAVE_WEBHOOK_HASH?.trim();
  if (!expected || !hash) return false;
  // Constant-time-ish comparison without importing node crypto into edge paths.
  if (hash.length !== expected.length) return false;
  let mismatch = 0;
  for (let index = 0; index < hash.length; index += 1) {
    mismatch |= hash.charCodeAt(index) ^ expected.charCodeAt(index);
  }
  return mismatch === 0;
}
