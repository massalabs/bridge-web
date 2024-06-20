import { Tooltip } from '@massalabs/react-ui-kit';
import { FiInfo } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store';

export interface ServiceFeeTooltipProps {
  inputAmount?: string;
  outputAmount?: string;
  serviceFee: string;
  symbol: string;
}

export function ServiceFeeTooltip(props: ServiceFeeTooltipProps) {
  const { inputAmount = '-', outputAmount = '-', serviceFee, symbol } = props;
  const { isMassaToEvm } = useOperationStore();

  function ServiceFeeTooltipBody() {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col gap-2">
          <div>{Intl.t('service-fee.sending')}</div>
          {inputAmount} {symbol}
        </div>
        <div>-</div>
        <div className="flex flex-col gap-2">
          <div>
            {Intl.t('service-fee.fee', {
              fee: isMassaToEvm() ? serviceFee : '0',
            })}
          </div>
          {outputAmount} {symbol}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Tooltip customClass="py-2" body={<ServiceFeeTooltipBody />}>
        <FiInfo className="mr-1" size={18} />
      </Tooltip>
    </div>
  );
}
