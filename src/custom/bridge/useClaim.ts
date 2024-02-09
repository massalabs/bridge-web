import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { RedeemOperationToClaim } from '../../utils/lambdaApi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import { useBridgeModeStore } from '@/store/store';

export function useClaim() {
  const { currentMode } = useBridgeModeStore();

  const bridgeContractAddr = config[currentMode].evmBridgeContract;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(
    (operation: RedeemOperationToClaim) => {
      writeContract({
        abi: bridgeVaultAbi,
        address: bridgeContractAddr,
        functionName: 'redeem',
        args: [
          operation.amount,
          operation.recipient,
          operation.inputOpId,
          operation.evmToken,
          operation.signatures,
        ],
      });
    },
    [writeContract, bridgeContractAddr],
  );

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return { isSuccess, error, write, hash };
}
