import { useEstimateFeesPerGas } from 'wagmi';

const VITE_CLAIM_GAS_COST = import.meta.env.VITE_CLAIM_GAS_COST || '92261';
const VITE_LOCK_GAS_COST = import.meta.env.VITE_LOCK_GAS_COST || '73185';
const VITE_APPROVE_GAS_COST = import.meta.env.VITE_APPROVE_GAS_COST || '29823';

export function useFeeEstimation() {
  const { data } = useEstimateFeesPerGas();

  const maxFeePerGas = data?.maxFeePerGas || 0n;

  const estimateClaimFees = () => BigInt(VITE_CLAIM_GAS_COST) * maxFeePerGas;

  const estimateLockFees = () => BigInt(VITE_LOCK_GAS_COST) * maxFeePerGas;

  const estimateApproveFees = () =>
    BigInt(VITE_APPROVE_GAS_COST) * maxFeePerGas;

  return { estimateClaimFees, estimateLockFees, estimateApproveFees };
}
