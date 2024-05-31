import { Tooltip } from '@massalabs/react-ui-kit';

interface AmountProps {
  amountFormattedPreview: string;
  symbol: string | undefined;
  amountFormattedFull: string;
}

export function Amount(props: AmountProps) {
  const { amountFormattedPreview, symbol, amountFormattedFull } = props;
  return (
    <div className="flex gap-2 items-center">
      {amountFormattedPreview} {symbol}
      <Tooltip body={`${amountFormattedFull} ${symbol}`} />
    </div>
  );
}
