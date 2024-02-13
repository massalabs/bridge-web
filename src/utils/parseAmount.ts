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

  let in2decimals: string;
  if (formattedIntegerPart === '0' && decimalPart.startsWith('00')) {
    in2decimals = `${formattedIntegerPart}${decimal}${roundDecimalPartToOneSignificantDigit(
      decimalPart,
    )}`;
  } else {
    in2decimals = currency(`${formattedIntegerPart}${decimal}${decimalPart}`, {
      separator: separator,
      decimal: decimal,
      symbol: '',
    }).format();
  }

  return {
    in2decimals,
    full: `${formattedIntegerPart}${decimal}${decimalPart}`,
  };
}

function padWithZeros(input: string, length: number): string {
  return input.padStart(length, '0');
}

export function roundDecimalPartToOneSignificantDigit(
  decimalPart: string,
): string {
  function countLeadingZeros(str: string) {
    // Match leading zeros using a regular expression
    const result = str.match(/^0+/);

    // If the result isn't null (meaning there are leading zeros), return the length, otherwise return 0
    return result ? result[0].length : 0;
  }

  // Strip leading zeroes
  const significantPart = decimalPart.replace(/^0+/, '');

  if (significantPart === '') {
    // Input is all zeroes
    return '0';
  }

  // The first digit of the significant part is our significant digit
  const firstDigit = significantPart[0];

  // Determine if we need to round up
  const shouldRoundUp =
    significantPart.length > 1 && parseInt(significantPart[1]) >= 5;

  // Prepare the significant digit after rounding if necessary
  const roundedDigit = shouldRoundUp
    ? (parseInt(firstDigit) + 1).toString()
    : firstDigit;

  // If rounding causes a carry-over (e.g. 0.009 -> 0.01), handle it
  if (roundedDigit === '10') {
    return '0'.repeat(countLeadingZeros(decimalPart) - 1) + roundedDigit[0];
  }

  return '0'.repeat(countLeadingZeros(decimalPart)) + roundedDigit;
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
  // formatting it to string for display
  const { in2decimals, full } = formatAmount(amt.toString(), token.decimals);

  return { in2decimals, full };
}
