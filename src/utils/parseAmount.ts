import currency from 'currency.js';
import { parseUnits } from 'viem';

export interface IFormatted {
  in2decimals: string;
  full: string;
}

export function parseAmount(amount: string, decimals = 18): bigint {
  let _amount = parseUnits(amount?.toString() || '0', decimals);

  return _amount;
}

export function formatAmount(amount: string, decimals = 18): IFormatted {
  const decimal = '.';

  const integerPart = amount.substring(0, amount.length - decimals);
  const decimalPart = amount.substring(amount.length - decimals);

  const formattedIntegerPart = currency(`${integerPart}`, {
    separator: ',',
    decimal: decimal,
    symbol: '',
    precision: 0,
  }).format();
  const formattedDecimalPart = decimalPart;

  return {
    in2decimals: currency(`${integerPart}.${decimalPart}`, {
      separator: ',',
      decimal: decimal,
      symbol: '',
    }).format(),
    full: `${formattedIntegerPart}${decimal}${formattedDecimalPart}`,
  };
}
