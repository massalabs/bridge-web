import { Tooltip } from '@massalabs/react-ui-kit';

interface AmountArgs {
  amountFormattedPreview: string;
  symbol: string | undefined;
  amountFormattedFull: string;
}

export function Amount(args: AmountArgs) {
  const { amountFormattedPreview, symbol, amountFormattedFull } = args;
  return (
    <div className="flex items-center">
      {amountFormattedPreview} {symbol}
      <Tooltip body={`${amountFormattedFull} ${symbol}`} />
    </div>
  );
}
