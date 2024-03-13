import { useEffect } from 'react';
import { U256_MAX } from '@massalabs/massa-web3';
import { erc20Abi } from 'viem';
import { useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { handleEvmApproveError } from './handlers/handleTransactionErrors';
import { useLock } from './useLock';
import { config } from '@/const/const';
import { Status } from '@/store/globalStatusesStore';
import {
  useBridgeModeStore,
  useGlobalStatusesStore,
  useTokenStore,
  useOperationStore,
} from '@/store/store';

export function useEvmApprove() {
  const { currentMode } = useBridgeModeStore();
  const { selectedToken } = useTokenStore();
  const { approve, setBox, setLock, setApprove } = useGlobalStatusesStore();
  const { write: writeLock } = useLock();
  const { amount } = useOperationStore();

  const bridgeContractAddr = config[currentMode].evmBridgeContract;
  const evmToken = selectedToken?.evmToken as `0x${string}`;

  const { data: hash, writeContract, error } = useWriteContract();

  const write = () => {
    writeContract({
      address: evmToken,
      abi: erc20Abi,
      functionName: 'approve',
      args: [bridgeContractAddr, U256_MAX],
    });
  };

  const { isSuccess } = useWaitForTransactionReceipt({
    hash,
  });

  useEffect(() => {
    if (approve !== Status.Loading) {
      return;
    }
    if (isSuccess && amount) {
      setApprove(Status.Success);
      setLock(Status.Loading);
      writeLock();
    } else if (error) {
      handleEvmApproveError(error);
      setBox(Status.Error);
      setApprove(Status.Error);
    }
  }, [
    approve,
    isSuccess,
    error,
    amount,
    setApprove,
    setLock,
    setBox,
    writeLock,
  ]);

  return { write };
}
