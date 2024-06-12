import { formatAmount } from '@massalabs/react-ui-kit';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import { retrievePercent } from '@/utils/utils';

interface AmountProps {
  inputAmount: string;
  outputAmount?: string;
  symbol?: string;
  decimals?: number;
}

export function Received(props: AmountProps) {
  const { inputAmount, outputAmount, symbol = '', decimals = 9 } = props;

  let outputPreview = '-';
  let outputFull = '-';

  if (outputAmount !== undefined && outputAmount !== null) {
    const formattedResult = formatAmount(outputAmount, decimals);
    outputPreview = formattedResult.preview;
    outputFull = formattedResult.full;
  }

  return (
    <div className="flex gap-2 items-center">
      {outputPreview} {symbol}
      <ServiceFeeTooltip
        inputAmount={formatAmount(inputAmount, decimals).full}
        outputAmount={outputFull}
        serviceFee={retrievePercent(inputAmount, outputAmount)}
        symbol={symbol || ''}
      />
    </div>
  );
}
