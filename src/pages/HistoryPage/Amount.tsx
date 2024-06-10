import { formatAmount, Tooltip } from '@massalabs/react-ui-kit';

interface AmountProps {
  amount?: string;
  symbol?: string;
  decimals?: number;
}

export function Amount(props: AmountProps) {
  const { amount, symbol = '', decimals = 9 } = props;

  let amountFormattedPreview = '-';
  let amountFormattedFull = '-';

  if (amount !== undefined) {
    const formattedResult = formatAmount(amount, decimals);
    amountFormattedPreview = formattedResult.amountFormattedPreview;
    amountFormattedFull = formattedResult.amountFormattedFull;
  }

  return (
    <div className="flex gap-2 items-center">
      {amountFormattedPreview} {symbol}
      <Tooltip body={`${amountFormattedFull} ${symbol}`} />
    </div>
  );
}
