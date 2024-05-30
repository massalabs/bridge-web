import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import { ethMinConfirmations } from '@/utils/const';

interface ClaimArguments {
  amount: string;
  recipient: string;
  inputOpId: string;
  evmToken: string;
  signatures: string[];
}

export function useClaim() {
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();

  const bridgeContractAddr = config[currentMode][selectedEvm];

  const { data: hash, writeContract, error, isPending } = useWriteContract();

  const write = useCallback(
    (operation: ClaimArguments) => {
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
    confirmations: ethMinConfirmations,
  });

  return { isPending, isSuccess, error, write, hash };
}
