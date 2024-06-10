import { Tooltip } from '@massalabs/react-ui-kit';
import Intl from '@/i18n/i18n';

export interface ServiceFeeTooltipProps {
  input: string;
  serviceFee: string;
  output: string;
  symbol: string;
}

export function ServiceFeeTooltip(props: ServiceFeeTooltipProps) {
  const { input, serviceFee, output, symbol } = props;
  const serviceFeeTooltipBody = (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-2">
        <div>{Intl.t('service-fee.sending')}</div>
        {input} {symbol}
      </div>
      <div>-</div>
      <div className="flex flex-col gap-2">
        <div>
          {Intl.t('service-fee.fee', {
            fee: serviceFee,
          })}
        </div>
        {output} {symbol}
      </div>
    </div>
  );

  return (
    <div className="flex items-center gap-2">
      <Tooltip customClass="py-2" body={serviceFeeTooltipBody} />
    </div>
  );
}
