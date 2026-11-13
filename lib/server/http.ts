import { ZodError } from 'zod';

export class ApiError extends Error {
  status: number;
  code: string;
  details?: unknown;

  constructor(status: number, message: string, code = 'request_failed', details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function json(data: unknown, init?: ResponseInit) {
  return Response.json(data, init);
}

export function errorResponse(error: unknown) {
  if (error instanceof ZodError) {
    return json(
      {
        ok: false,
        error: 'Please check the details you entered.',
        code: 'validation_failed',
        details: error.flatten(),
      },
      { status: 422 }
    );
  }

  if (error instanceof ApiError) {
    return json(
      { ok: false, error: error.message, code: error.code, details: error.details },
      { status: error.status }
    );
  }

  console.error('[api] unhandled error', error);
  return json(
    { ok: false, error: 'Something went wrong on our side. Please try again.', code: 'server_error' },
    { status: 500 }
  );
}

export async function readJson(request: Request) {
  try {
    return (await request.json()) as unknown;
  } catch {
    throw new ApiError(400, 'Send a valid JSON body.', 'invalid_json');
  }
}

export function assertSameOrigin(request: Request) {
  const origin = request.headers.get('origin');
  if (!origin) return;

  const host = request.headers.get('host');
  if (!host) return;

  try {
    if (new URL(origin).host !== host) {
      throw new ApiError(403, 'Cross-origin request blocked.', 'forbidden_origin');
    }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(403, 'Invalid request origin.', 'forbidden_origin');
  }
}
