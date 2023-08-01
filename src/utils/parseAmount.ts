import currency from 'currency.js';

export interface IFormatted {
  in2decimals: string;
  full: string;
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
