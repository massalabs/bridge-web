import { useCallback } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
} from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN, config } from '@/const/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { getMinConfirmation } from '@/utils/utils';

export function useLock() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { connectedAccount } = useAccountStore();
  const { inputAmount: amount } = useOperationStore();
  const [debouncedAmount] = useDebounceValue(amount, 500);
  const { chainId } = useAccount();

  const chain = chainId || 0;

  const bridgeContractAddr =
    config[currentMode][CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN[chain]];

  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(() => {
    writeContract({
      address: bridgeContractAddr,
      abi: bridgeVaultAbi,
      functionName: 'lock',
      args: [
        debouncedAmount?.toString(),
        connectedAccount?.address(),
        evmToken,
      ],
    });
  }, [
    debouncedAmount,
    connectedAccount,
    evmToken,
    bridgeContractAddr,
    writeContract,
  ]);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: getMinConfirmation(CHAIN_ID_TO_SUPPORTED_BLOCKCHAIN[chain]),
  });

  return { write, hash, isSuccess, error };
}
