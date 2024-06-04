import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN, config } from '@/const/const';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import { getMinConfirmation } from '@/utils/utils';

interface ClaimArguments {
  amount: string;
  recipient: string;
  inputOpId: string;
  evmToken: string;
  signatures: string[];
  chainId: number;
}

export function useClaim() {
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();

  const { data: hash, writeContract, error, isPending } = useWriteContract();

  const write = useCallback(
    (operation: ClaimArguments) => {
      const targetBlockchain =
        CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN[operation.chainId];

      const bridgeContractAddr = config[currentMode][targetBlockchain];

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
    [writeContract, currentMode],
  );

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: getMinConfirmation(selectedEvm),
  });

  return { isPending, isSuccess, error, write, hash };
}
