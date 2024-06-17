import { formatAmount } from '@massalabs/react-ui-kit';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import Intl from '@/i18n/i18n';
import { useTokenStore, useOperationStore } from '@/store/store';
import { serviceFeeToPercent } from '@/utils/utils';

export function OperationOutput() {
  const { outputAmount, inputAmount } = useOperationStore();
  const { selectedToken } = useTokenStore();
  const { serviceFee } = useServiceFee();

  return (
    <div className="flex itmes-center w-full justify-between mas-menu-default">
      <div className="flex items-center gap-2">
        <ServiceFeeTooltip
          inputAmount={formatAmount(inputAmount || '', 18).full}
          symbol={selectedToken?.symbol || ''}
          serviceFee={serviceFeeToPercent(serviceFee)}
          outputAmount={formatAmount(outputAmount || '', 18).full}
        />
        {Intl.t('index.input.placeholder.receive')}
      </div>
      <div>
        {`${formatAmount(outputAmount || '', selectedToken?.decimals).full} ${
          selectedToken?.symbol
        }`}
      </div>
    </div>
  );
}
