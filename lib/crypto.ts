/**
 * Cryptographic utility for hashing flags on the client before sending them to the database.
 * Uses the Web Crypto API.
 */
export async function hashFlag(flag: string): Promise<string> {
  const encoder = new TextEncoder();
  // We trim and lowercase to make matching slightly more robust, if desired.
  // The same normalization must be applied when checking the answer.
  const data = encoder.encode(flag.trim().toLowerCase());
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}
