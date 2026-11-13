import { json } from '@/lib/server/http';
import { paymentMode } from '@/lib/server/payments';
import { databaseLabel, ping } from '@/lib/server/db';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await ping();
    return json({
      ok: true,
      service: 'hamubere-backend',
      database: databaseLabel,
      payments: paymentMode(),
      time: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[health] database check failed', error);
    return json({ ok: false, service: 'hamubere-backend' }, { status: 503 });
  }
}
