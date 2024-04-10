import { SyntheticEvent, useEffect } from 'react';
import { parseUnits } from 'viem';
import {
  handleEvmApproveError,
  handleLockError,
} from '@/custom/bridge/handlers/handleTransactionErrors';
import { validate } from '@/custom/bridge/handlers/validateTransaction';
import { useEvmApprove } from '@/custom/bridge/useEvmApprove';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useLock } from '@/custom/bridge/useLock';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { useTokenStore } from '@/store/tokenStore';

export function useSubmitBridge() {
  const { selectedToken } = useTokenStore();

  const { setMint, setBox, setLock, setApprove, approve } =
    useGlobalStatusesStore();
  const { amount, setLockTxId } = useOperationStore();
  const {
    write: writeEvmApprove,
    isSuccess: approveSuccess,
    error: approveError,
  } = useEvmApprove();
  const { allowance: allowanceEVM, tokenBalance: tokenBalanceEVM } =
    useEvmToken();
  const {
    write: writeLock,
    isSuccess: isLockSuccess,
    hash: lockHash,
    error: lockError,
  } = useLock();

  useEffect(() => {
    if (approve !== Status.Loading) {
      return;
    }
    if (approveSuccess && amount) {
      console.log('Approve success');
      setApprove(Status.Success);
      console.log('Approve Loading');
      setLock(Status.Loading);
      writeLock();
    } else if (approveError) {
      handleEvmApproveError(approveError);
      setBox(Status.Error);
      setApprove(Status.Error);
    }
  }, [
    approve,
    approveSuccess,
    approveError,
    amount,
    setApprove,
    setLock,
    setBox,
    writeLock,
  ]);

  useEffect(() => {
    if (lockHash) {
      console.log('Lock hash', lockHash);
      setLockTxId(lockHash);
    }
    if (isLockSuccess) {
      console.log('Lock success');
      setLock(Status.Success);
      setMint(Status.Loading);
    }
    if (lockError) {
      console.log('Lock error');
      handleLockError(lockError);
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [
    isLockSuccess,
    lockHash,
    lockError,
    setBox,
    setLock,
    setLockTxId,
    setMint,
  ]);

  function handleSubmitBridge(e: SyntheticEvent) {
    console.log('handleSubmitBridge');
    e.preventDefault();
    // validate amount to transact
    if (!validate(tokenBalanceEVM) || !amount || !selectedToken) return;

    // set loading box state which renders pending operation layout
    setBox(Status.Loading);

    // Init bridge approval
    setApprove(Status.Loading);
    let parsedAmount = parseUnits(amount, selectedToken.decimals);
    const needApproval = allowanceEVM < parsedAmount;

    if (needApproval) {
      console.log('Need approval');
      // writing bridge approval
      writeEvmApprove();
      return;
    }
    // Bridge does not need approval : writing lock
    setApprove(Status.Success);

    writeLock();
    setLock(Status.Loading);
  }
  return { handleSubmitBridge };
}
