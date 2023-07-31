import { parseUnits } from 'viem';

export function parseAmount(amount: string, decimals = 18): bigint {
  let _amount = parseUnits(amount?.toString() || '0', decimals);

  return _amount;
}

export function formatAmount(amount: string, decimals = 18): string {
  const parseAmount = BigInt(amount.substring(0, amount.length - decimals));

  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: decimals,
  })
    .format(parseAmount)
    .concat(
      '.' +
        new Intl.NumberFormat('en-US', {
          maximumSignificantDigits: 2,
        }).format(
          BigInt(amount.substring(amount.length - decimals)) /
            BigInt(10 ** decimals),
        ),
    );
}

export function formatEvmAmount(amount: string, decimals = 2): string {
  return new Intl.NumberFormat('en-US', {
    maximumSignificantDigits: decimals,
  }).format(Number(amount));
}
