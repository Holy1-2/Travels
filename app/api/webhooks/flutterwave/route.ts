import { json, readJson } from '@/lib/server/http';
import { settleVerifiedTransaction } from '@/lib/server/payments';
import { validWebhookHash, verifyTransaction } from '@/lib/server/payments/flutterwave';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface WebhookBody {
  event?: string;
  data?: { id?: number | string; tx_ref?: string; status?: string };
}

/**
 * Flutterwave webhook. Set FLUTTERWAVE_WEBHOOK_HASH to the secret hash from
 * your Flutterwave dashboard. The signature check is followed by a direct API
 * verification so a spoofed payload cannot mark a booking as paid.
 */
export async function POST(request: Request) {
  const hash = request.headers.get('verif-hash');
  if (!validWebhookHash(hash)) {
    return json({ ok: false, error: 'Invalid signature.' }, { status: 401 });
  }

  let body: WebhookBody;
  try {
    body = (await readJson(request)) as WebhookBody;
  } catch {
    return json({ ok: false, error: 'Invalid JSON.' }, { status: 400 });
  }

  if (!body.data?.id) {
    return json({ ok: true, ignored: true });
  }

  try {
    const transaction = await verifyTransaction(body.data.id);
    const result = settleVerifiedTransaction(transaction);
    return json({ ok: true, settled: result.ok });
  } catch (error) {
    console.error('[payments] webhook verification failed', error);
    // Returning 5xx asks Flutterwave to retry the webhook.
    return json({ ok: false, error: 'Verification failed.' }, { status: 502 });
  }
}
