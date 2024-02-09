import { useCallback } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';

export function useLock() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { connectedAccount } = useAccountStore();
  const { amount } = useOperationStore();
  const [debouncedAmount] = useDebounceValue(amount, 500);

  const bridgeContractAddr = config[currentMode].evmBridgeContract;
  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = useCallback(() => {
    const _amount = parseUnits(
      debouncedAmount || '0',
      selectedToken?.decimals || 18,
    );
    writeContract({
      address: bridgeContractAddr,
      abi: bridgeVaultAbi,
      functionName: 'lock',
      args: [_amount.toString(), connectedAccount?.address(), evmToken],
    });
  }, [
    debouncedAmount,
    selectedToken,
    connectedAccount,
    evmToken,
    bridgeContractAddr,
  ]);

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  return { isSuccess, error, write, hash };
}
