import { useCallback, useEffect } from 'react';
import { useDebounceValue } from 'usehooks-ts';
import { parseUnits } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { handleMintBridge } from './handlers/handleMintBridge';
import { handleLockError } from './handlers/handleTransactionErrors';
import bridgeVaultAbi from '@/abi/bridgeAbi.json';
import { config } from '@/const/const';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { ethMinConfirmations } from '@/utils/const';

export function useLock() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { connectedAccount, massaClient } = useAccountStore();
  const { amount, setLockTxId } = useOperationStore();
  const { setLock, setBox, lock } = useGlobalStatusesStore();
  const [debouncedAmount] = useDebounceValue(amount, 500);

  const bridgeContractAddr = config[currentMode].evmBridgeContract;
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

  useEffect(() => {
    setLockTxId(hash);
    if (lock !== Status.Loading) {
      return;
    }
    if (isSuccess) {
      setLock(Status.Success);
      if (!hash) return;
      // Set lock id
      if (!massaClient) return;
      handleMintBridge();
    }
    if (error) {
      handleLockError(error);
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [isSuccess, error, hash, massaClient, lock, setLock, setBox, setLockTxId]);

  return { write };
}
