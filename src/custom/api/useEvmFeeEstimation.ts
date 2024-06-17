import { useCallback, useEffect, useState } from 'react';
import { useEstimateFeesPerGas } from 'wagmi';

const VITE_CLAIM_GAS_COST = import.meta.env.VITE_CLAIM_GAS_COST || '65484';
const VITE_LOCK_GAS_COST = import.meta.env.VITE_LOCK_GAS_COST || '85676';
const VITE_APPROVE_GAS_COST = import.meta.env.VITE_APPROVE_GAS_COST || '30846';

export function useEvmFeeEstimation() {
  const { data, refetch } = useEstimateFeesPerGas();
  const [maxFeePerGas, setMaxFeePerGas] = useState(0n);

  useEffect(() => {
    setMaxFeePerGas(data?.maxFeePerGas || 0n);
    const intervalId = setInterval(() => {
      refetch().then((newData) => {
        setMaxFeePerGas(newData.data?.maxFeePerGas || 0n);
      });
    }, 10000);

    return () => clearInterval(intervalId);
  }, [data, refetch]);

  const estimateClaimFees = useCallback((): bigint => {
    return BigInt(VITE_CLAIM_GAS_COST) * maxFeePerGas;
  }, [maxFeePerGas]);

  const estimateLockFees = useCallback((): bigint => {
    return BigInt(VITE_LOCK_GAS_COST) * maxFeePerGas;
  }, [maxFeePerGas]);

  const estimateApproveFees = useCallback((): bigint => {
    return BigInt(VITE_APPROVE_GAS_COST) * maxFeePerGas;
  }, [maxFeePerGas]);

  return { estimateClaimFees, estimateLockFees, estimateApproveFees };
}
