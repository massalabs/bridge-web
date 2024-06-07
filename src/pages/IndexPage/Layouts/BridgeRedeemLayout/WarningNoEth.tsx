import { formatAmount } from '@massalabs/react-ui-kit';
import { FiAlertTriangle } from 'react-icons/fi';
import { useAccount, useBalance } from 'wagmi';
import { useFeeEstimation } from '@/custom/api/useFeeEstimation';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

export function WarningNoEth() {
  const { side } = useOperationStore();
  const { address, chain } = useAccount();
  const { estimateClaimFees } = useFeeEstimation();

  const { data } = useBalance({
    address,
  });

  if (!address || !data || !chain) return null;

  if (side === SIDE.EVM_TO_MASSA || data?.value !== 0n) return null;

  const estimatedFees = estimateClaimFees();
  const fees =
    estimatedFees > 0n
      ? formatAmount(estimatedFees.toString(), 18).amountFormattedFull
      : '';
  return (
    <div className="flex items-center gap-2">
      <FiAlertTriangle className="text-s-warning" size={24} />
      <p className="mas-body2 text-s-warning">
        {Intl.t('index.warning-no-eth', {
          fees,
          symbol: chain.nativeCurrency.symbol,
        })}
      </p>
    </div>
  );
}
