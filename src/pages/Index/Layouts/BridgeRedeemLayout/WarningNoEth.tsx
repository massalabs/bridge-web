import { useEffect, useState } from 'react';
import { fetchBalance } from '@wagmi/core';
import { FiAlertTriangle } from 'react-icons/fi';
import { formatEther } from 'viem';
import { useAccount } from 'wagmi';
import { useFeeEstimation } from '@/custom/api/useFeeEstimation';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/store';
import { SIDE } from '@/utils/const';

export function WarningNoEth() {
  const { side } = useOperationStore();
  const { address } = useAccount();
  const { estimateClaimFees } = useFeeEstimation();

  const [ethBalance, setEthBalance] = useState<bigint>();

  useEffect(() => {
    if (!address) return;
    fetchBalance({ address }).then((balanceResult) => {
      setEthBalance(balanceResult.value);
    });
  }, [address]);

  if (!address) return null;

  if (side === SIDE.EVM_TO_MASSA || ethBalance !== 0n) return null;

  const estimatedFees = estimateClaimFees();
  const fees = estimatedFees > 0n ? formatEther(estimatedFees) : '';

  return (
    <div className="flex items-center gap-2">
      <FiAlertTriangle className="text-s-warning" size={24} />
      <p className="mas-body2 text-s-warning">
        {Intl.t('index.warning-no-eth', { fees })}
      </p>
    </div>
  );
}
