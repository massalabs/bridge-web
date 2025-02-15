import { formatAmount } from '@massalabs/react-ui-kit';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import { getServiceFeeAmount, retrievePercent } from '@/utils/utils';

interface AmountProps {
  inputAmount: string;
  outputAmount?: string;
  symbol?: string;
  decimals?: number;
}

export function Received(props: AmountProps) {
  const { inputAmount, outputAmount, symbol = '', decimals = 9 } = props;

  let output = '-';

  if (outputAmount !== undefined && outputAmount !== null) {
    const formattedResult = formatAmount(outputAmount, decimals);
    output = formattedResult.preview;
  }

  const serviceFeeAmount = getServiceFeeAmount(
    BigInt(inputAmount),
    retrievePercent(inputAmount, outputAmount).serviceFee,
  );

  return (
    <div className="flex gap-2 items-center">
      {output} {symbol}
      <ServiceFeeTooltip
        inputAmount={formatAmount(inputAmount, decimals).full}
        serviceFeeAmount={formatAmount(serviceFeeAmount, decimals).full}
        serviceFeePercent={retrievePercent(inputAmount, outputAmount).percent}
        symbol={symbol || ''}
      />
    </div>
  );
}
