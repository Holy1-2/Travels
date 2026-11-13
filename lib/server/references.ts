import { randomBytes, randomUUID } from 'node:crypto';

// No 0/O/1/I to keep references easy to read over the phone.
const ALPHABET = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';

function code(length: number) {
  const bytes = randomBytes(length);
  let output = '';
  for (let index = 0; index < length; index += 1) {
    output += ALPHABET[bytes[index] % ALPHABET.length];
  }
  return output;
}

export function bookingReference() {
  return `HAM-${code(6)}`;
}

export function paymentId() {
  return `pay_${randomUUID().replace(/-/g, '').slice(0, 24)}`;
}

export function listingRequestId() {
  return `LIST-${code(6)}`;
}

export function uniqueReference(exists: (reference: string) => boolean) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const reference = bookingReference();
    if (!exists(reference)) return reference;
  }
  return `HAM-${code(8)}`;
}
