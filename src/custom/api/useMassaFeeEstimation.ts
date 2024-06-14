import { useCallback } from 'react';
import { toMAS } from '@massalabs/massa-web3';
import { increaseAllowanceStorageCost } from '@/bridge/storage-cost';
import { forwardBurnFees, increaseAllowanceFee } from '@/const';
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
  const { massaClient } = useAccountStore();

  const estimateFeesMassa = useCallback(async (): Promise<EstimateFeesMas> => {
    if (!inputAmount || !selectedToken) {
      return { feesMAS: 0n, storageMAS: 0n };
    }

    let storageMAS = forwardBurnFees.coins;
    let feesMAS = (await massaClient?.publicApi().getMinimalFees()) || 0n;
    if (
      selectedToken?.allowance === 0n ||
      selectedToken?.allowance < inputAmount
    ) {
      storageMAS += await increaseAllowanceStorageCost();

      feesMAS += increaseAllowanceFee.fee;
    }
    return { feesMAS, storageMAS };
  }, [inputAmount, selectedToken]);
  return { estimateFeesMassa };
}

export function formatTotalMasFees(
  feesCostMAS: bigint | undefined,
  storageCostMAS: bigint | undefined,
) {
  return toMAS((storageCostMAS ?? 0n) + (feesCostMAS ?? 0n)).toString();
}

export function formatTotalMasStorage(storageCostMAS: bigint | undefined) {
  return storageCostMAS ? toMAS(storageCostMAS).toString() : '';
}
