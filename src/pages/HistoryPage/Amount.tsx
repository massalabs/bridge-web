import { formatAmount, Tooltip } from '@massalabs/react-ui-kit';

interface AmountProps {
  amount?: string;
  symbol?: string;
  decimals?: number;
}

export function Amount(props: AmountProps) {
  const { amount, symbol = '', decimals = 9 } = props;

  let preview = '-';
  let full = '-';

  if (amount !== undefined) {
    const formattedResult = formatAmount(amount, decimals);
    preview = formattedResult.preview;
    full = formattedResult.full;
  }

  return (
    <div className="flex gap-2 items-center">
      {preview} {symbol}
      <Tooltip body={`${full} ${symbol}`} />
    </div>
  );
}
