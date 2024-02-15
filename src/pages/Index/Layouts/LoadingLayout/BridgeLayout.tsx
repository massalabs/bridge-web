import { useEffect } from 'react';
import { LoadingState } from './LoadingState';
import { ShowLinkToExplorers } from './ShowLinkToExplorers';
import { handleMintBridge } from '@/custom/bridge/handlers/handleMintBridge';
import {
  handleEvmApproveError,
  handleLockError,
} from '@/custom/bridge/handlers/handleTransactionErrors';
import { useEvmApprove } from '@/custom/bridge/useEvmApprove';
import { useLock } from '@/custom/bridge/useLock';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
} from '@/store/store';
import { EVM_EXPLORER } from '@/utils/const';

export function BridgeLayout() {
  const { approve, lock, mint } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();
  const { lockTxId, amount, setLockTxId } = useOperationStore();
  const { setBox, setLock, setApprove } = useGlobalStatusesStore();
  const { massaClient } = useAccountStore();

  const explorerUrl = `${EVM_EXPLORER[currentMode]}tx/${lockTxId}`;

  const { isSuccess: approveIsSuccess, error: approveError } = useEvmApprove();

  const {
    isSuccess: lockIsSuccess,
    write: writeLock,
    hash: lockHash,
    error: lockError,
  } = useLock();

  useEffect(() => {
    if (approveIsSuccess) {
      setApprove(Status.Success);
      if (!amount) return;
      setLock(Status.Loading);
      writeLock();
    }
    if (approveError) {
      handleEvmApproveError(approveError);
      setBox(Status.Error);
      setApprove(Status.Error);
    }
  }, [
    approveIsSuccess,
    approveError,
    amount,
    setApprove,
    setLock,
    setBox,
    writeLock,
  ]);

  useEffect(() => {
    if (lockIsSuccess) {
      setLock(Status.Success);
      if (!lockHash) return;
      // Set lock id
      setLockTxId(lockHash);
      if (!massaClient) return;
      handleMintBridge();
    }
    if (lockError) {
      handleLockError(lockError);
      setBox(Status.Error);
      setLock(Status.Error);
    }
  }, [
    lockIsSuccess,
    lockError,
    lockHash,
    massaClient,
    setLock,
    setBox,
    setLockTxId,
  ]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.approve')}</p>
        <LoadingState state={approve} />
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.lock')}</p>
        <LoadingState state={lock} />
      </div>
      <div className="flex justify-between mb-6 ">
        <p className="mas-body-2">{Intl.t('index.loading-box.mint')}</p>
        <LoadingState state={mint} />
      </div>
      <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={lockTxId} />
    </div>
  );
}
