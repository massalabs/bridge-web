import currency from 'currency.js';
import { parseUnits } from 'viem';
import { IToken } from '@/store/tokenStore';

export interface IFormatted {
  in2decimals: string;
  full: string;
}

export function formatAmount(
  amount: string,
  decimals = 18,
  separator = ',',
): IFormatted {
  const decimal = '.';

  if (amount.length < decimals) {
    amount = padWithZeros(amount, decimals + 1);
  }

  const integerPart = amount.substring(0, amount.length - decimals);
  const decimalPart = amount.substring(amount.length - decimals);

  const formattedIntegerPart = currency(`${integerPart}`, {
    separator: separator,
    decimal: decimal,
    symbol: '',
    precision: 0,
  }).format();
  const formattedDecimalPart = decimalPart;

  return {
    in2decimals: currency(`${integerPart}.${decimalPart}`, {
      separator: separator,
      decimal: decimal,
      symbol: '',
    }).format(),
    full: `${formattedIntegerPart}${decimal}${formattedDecimalPart}`,
  };
}

function padWithZeros(input: string, length: number): string {
  return input.padStart(length, '0');
}

export function formatAmountToDisplay(
  amount: string,
  token: IToken | undefined,
): {
  full: string;
  in2decimals: string;
} {
  if (!token || !amount) {
    return {
      full: '0',
      in2decimals: '0',
    };
  }
  // parsing to Bigint to get correct amount
  const amt = parseUnits(amount, token.decimals);
  // formating it to string for display
  const { in2decimals, full } = formatAmount(amt.toString(), token.decimals);

  return { in2decimals, full };
}
