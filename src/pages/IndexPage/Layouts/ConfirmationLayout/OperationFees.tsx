import { useAccount } from 'wagmi';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import Intl from '@/i18n/i18n';
import { serviceFeeToPercent } from '@/utils/utils';
export function OperationFees() {
  const { serviceFee } = useServiceFee();
  const { chain } = useAccount();

  // waiting for FeeEstimation refactor
  return (
    <div className="mas-caption flex flex-col gap-2">
      <div className="flex items-center w-full justify-between">
        <div>{`${chain?.name} ${Intl.t('confirmation.fees')}`}</div>
        <div>1000</div>
      </div>
      <div className="flex items-center w-full  justify-between">
        <div>{`${Intl.t('general.Massa')} ${Intl.t('confirmation.fees')}`}</div>
        <div>0</div>
      </div>
      <div className="flex items-center w-full  justify-between">
        <div>{Intl.t('confirmation.service-fee')}</div>
        <div>{serviceFeeToPercent(serviceFee)}</div>
      </div>
    </div>
  );
}
