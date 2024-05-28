import { useEffect, useState } from 'react';
import { LoadingState } from './LoadingState';
import { ShowLinkToExplorers } from './ShowLinkToExplorers';

import { useFetchMintEvent } from '@/custom/bridge/useFetchMintEvent';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore, useOperationStore } from '@/store/store';

export function BridgeLayout() {
  const { approve, lock, mint, setMint, setBox } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();
  const { lockTxId, mintTxId, setMintTxId } = useOperationStore();

  const [currentIdToDisplay, setCurrentIdToDisplay] = useState<string>();

  const lambdaResponse = useFetchMintEvent();

  const lambdaResponseIsEmpty =
    lambdaResponse === undefined || lambdaResponse.length === 0;

  useEffect(() => {
    if (lock !== Status.Success) return;
    if (lambdaResponseIsEmpty) return;
    setMintTxId(lambdaResponse[0].outputId || '');
    if (lambdaResponse[0].isConfirmed) {
      setBox(Status.Success);
      setMint(Status.Success);
    }
  }, [
    lambdaResponse,
    lambdaResponseIsEmpty,
    lock,
    setMintTxId,
    setBox,
    setMint,
  ]);

  useEffect(() => {
    if (lockTxId && lock !== Status.Success) {
      setCurrentIdToDisplay(lockTxId);
    }
    if (lock === Status.Success && mintTxId) {
      setCurrentIdToDisplay(mintTxId);
    }
  }, [lockTxId, lock, mintTxId, currentMode]);

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
      <ShowLinkToExplorers currentTxID={currentIdToDisplay} />
    </div>
  );
}
