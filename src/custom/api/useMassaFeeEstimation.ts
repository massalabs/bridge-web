import { useCallback } from 'react';
import { forwardBurnFees } from '../bridge/useBurn';
import { increaseAllowanceStorageCost } from '@/bridge/storage-cost';

import { useOperationStore } from '@/store/operationStore';
import { useAccountStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';

export interface EstimateFeesMas {
  feesMAS: bigint;
  storageMAS: bigint;
}

export function useMassaFeeEstimation() {
  const { selectedToken } = useTokenStore();
  const { inputAmount } = useOperationStore();
  const { minimalFees } = useAccountStore();

  const estimateFeesMassa = useCallback((): EstimateFeesMas => {
    console.log('calculating massa fees');
    if (!inputAmount || !selectedToken) {
      return { feesMAS: 0n, storageMAS: 0n };
    }

    let feesMAS = minimalFees;
    let storageMAS = forwardBurnFees.coins;
    if (
      selectedToken?.allowance === 0n ||
      selectedToken?.allowance < inputAmount
    ) {
      console.log('allowance is inferior to inputAmount');
      console.log('selectedToken?.allowance', selectedToken?.allowance);
      storageMAS += increaseAllowanceStorageCost();
      feesMAS += minimalFees;
    }

    return { feesMAS, storageMAS };
  }, [inputAmount, selectedToken?.allowance]);

  return { estimateFeesMassa };
}

export function addFeesAndStorageCost(
  feesCostMAS: bigint | undefined,
  storageCostMAS: bigint | undefined,
) {
  return (storageCostMAS ?? 0n) + (feesCostMAS ?? 0n);
}
