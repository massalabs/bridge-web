/**
 * Masks the middle of an address with a specified character.
 * @param str - The address to mask.
 * @param mask - The character to use for masking. Defaults to `.`.
 * @returns The masked address.
 */

export const TX_CHAR_LIMIT = 4;
export const DEFAULT_ADDRESS_CHAR_LIMIT = 8;

export function maskAddress(
  str: string,
  length = DEFAULT_ADDRESS_CHAR_LIMIT,
  mask = '...',
): string {
  const start = length;
  const end = str?.length - length;

  return str ? str?.substring(0, start) + mask + str?.substring(end) : '';
}
