import { parseUnits } from 'viem';

export function parseAmount(amount: string, decimals = 18): bigint {
  let _amount = parseUnits(amount?.toString() || '0', decimals);

  return _amount;
}
