import { formatAmount } from '@massalabs/react-ui-kit';
import { useAccount, useBalance } from 'wagmi';
import { EstimatedAmount } from '@/components/EstimatedAmount';
import { formatTotalMasFees } from '@/custom/api/useMassaFeeEstimation';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/operationStore';
import { serviceFeeToPercent } from '@/utils/utils';
export function OperationFees() {
  const { serviceFee } = useServiceFee();
  const { chain, address } = useAccount();
  const { feesMAS, feesETH, storageMAS } = useOperationStore();
  const { data: balanceData } = useBalance({
    address,
  });

  return (
    <div className="mas-caption flex flex-col gap-2">
      <div className="flex items-center w-full justify-between">
        <div>{`${chain?.name} ${Intl.t('confirmation.fees')}`}</div>
        <EstimatedAmount
          amount={formatAmount(feesETH || '', 18).full}
          symbol={balanceData?.symbol}
        />
      </div>
      <div className="flex items-center w-full  justify-between">
        <div>{`${Intl.t('general.Massa')} ${Intl.t('confirmation.fees')}`}</div>
        <div>{formatTotalMasFees(feesMAS, storageMAS)}</div>
      </div>
      <div className="flex items-center w-full  justify-between">
        <div>{Intl.t('confirmation.service-fee')}</div>
        <div>{serviceFeeToPercent(serviceFee)}</div>
      </div>
    </div>
  );
}
