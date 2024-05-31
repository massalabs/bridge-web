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
      <Tooltip
        customClass="mas-caption w-fit whitespace-nowrap px-2 py-1"
        body={`${amountFormattedFull} ${symbol}`}
      />
    </div>
  );
}
