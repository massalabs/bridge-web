import { useCallback } from 'react';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { useConnectedEvmChain } from './useConnectedEvmChain';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config, SupportedEvmBlockchain } from '@/const/const';
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

  const { data: hash, writeContract, error, isPending } = useWriteContract();

  const write = useCallback(
    (operation: ClaimArguments) => {
      const selectedSupportedBlockchain = Object.values(
        SupportedEvmBlockchain,
      ).find((s) => {
        return chain.toString() === s;
      });
      if (!selectedSupportedBlockchain) {
        console.error('Unsupported EVM network');
        return;
      }

      const bridgeContractAddr =
        config[currentMode][selectedSupportedBlockchain];

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
    [writeContract, chain, currentMode],
  );

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: getMinConfirmation(selectedEvm),
  });

  return { isPending, isSuccess, error, write, hash };
}
