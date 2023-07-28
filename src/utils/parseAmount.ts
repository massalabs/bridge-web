import { parseUnits } from 'viem';

export function parseAmount(amount: string, decimals = 18): bigint {
  let _amount = parseUnits(amount?.toString() || '0', decimals);

  return _amount;
}

export function formatAmount(amount: string, decimals = 18): string {
  return new Intl.NumberFormat('en-IN', {
    maximumSignificantDigits: decimals,
  }).format(stringToBigInt(amount));
}

function stringToBigInt(str: string): bigint {
  return BigInt(str.replace('.', ''));
}
