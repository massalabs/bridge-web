/**
 * Masks the middle of an address with a specified character.
 * @param str - The address to mask.
 * @param mask - The character to use for masking. Defaults to `.`.
 * @returns The masked address.
 */

export function maskAddress(str: string, length = 4, mask = '...'): string {
  const start = length;
  const end = str?.length - length;

  return str ? str?.substring(0, start) + mask + str?.substring(end) : '';
}
