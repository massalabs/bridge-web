import { useCallback } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { SupportedEvmBlockchain, config } from '@/const/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { ethMinConfirmations } from '@/utils/const';

export function useLock() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { connectedAccount } = useAccountStore();
  const { amount, selectedEvm } = useOperationStore();
  const [debouncedAmount] = useDebounceValue(amount, 500);

  const bridgeContractAddr =
    selectedEvm === SupportedEvmBlockchain.ETH
      ? config[currentMode].ethBridgeContract
      : config[currentMode].bscBridgeContract;

  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(() => {
    const amountInBigInt = parseUnits(
      debouncedAmount || '0',
      selectedToken?.decimals || 18,
    );
    writeContract({
      address: bridgeContractAddr,
      abi: bridgeVaultAbi,
      functionName: 'lock',
      args: [amountInBigInt.toString(), connectedAccount?.address(), evmToken],
    });
  }, [
    debouncedAmount,
    selectedToken,
    connectedAccount,
    evmToken,
    bridgeContractAddr,
    writeContract,
  ]);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
    confirmations: ethMinConfirmations,
  });

  return { write, hash, isSuccess, error };
}
