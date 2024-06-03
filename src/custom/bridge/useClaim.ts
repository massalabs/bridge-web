import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useConnectedEvmChain } from './useConnectedEvmChain';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import { getMinConfirmation } from '@/utils/utils';

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
  const chain = useConnectedEvmChain();

  // selected evm is what we want when context is bridge; when claim page we want the connected chain
  const bridgeContractAddr = config[currentMode][chain];

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
    confirmations: getMinConfirmation(selectedEvm),
  });

  return { isPending, isSuccess, error, write, hash };
}
