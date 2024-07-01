import { formatAmount } from '@massalabs/react-ui-kit';
import { useAccount, useBalance } from 'wagmi';
import { EstimatedAmount } from '@/components/EstimatedAmount';

import { MASSA_TOKEN } from '@/const';
import { addFeesAndStorageCost } from '@/custom/api/useMassaFeeEstimation';

import Intl from '@/i18n/i18n';
import { useTokenStore } from '@/store';
import { useOperationStore } from '@/store/operationStore';

export function OperationFees() {
  const { chain, address } = useAccount();
  const { selectedToken } = useTokenStore();
  const { feesMAS, feesETH, storageMAS, serviceFeeAmount } =
    useOperationStore();
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
        <div>
          {`${
            formatAmount(addFeesAndStorageCost(feesMAS, storageMAS)).full
          } ${MASSA_TOKEN}`}
        </div>
      </div>
      <div className="flex items-center w-full  justify-between">
        <div>{Intl.t('confirmation.service-fee')}</div>
        <div>{`${
          formatAmount(serviceFeeAmount || 0n, selectedToken?.decimals).full
        } ${selectedToken?.symbol}`}</div>
      </div>
    </div>
  );
}
