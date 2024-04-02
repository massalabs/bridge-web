import { useEffect, useState } from 'react';
import { LoadingState } from './LoadingState';
import { ShowLinkToExplorers } from './ShowLinkToExplorers';
import Intl from '@/i18n/i18n';
import { Status, useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useBridgeModeStore, useOperationStore } from '@/store/store';
import { EVM_EXPLORER } from '@/utils/const';

export function BridgeLayout() {
  const { approve, lock, mint } = useGlobalStatusesStore();
  const { currentMode } = useBridgeModeStore();
  const { lockTxId, mintTxId } = useOperationStore();

  const [currentID, setCurrentID] = useState<string | undefined>(undefined);

  useEffect(() => {
    console.log('lock', lock);
    console.log('lockTxId', lockTxId);
    console.log('mint', mint);
    if (lock !== Status.None && mint === Status.None) {
      console.log('lock', lock);
      console.log('lockTxId', lockTxId);
      setCurrentID(lockTxId);
    }
    // if (lock === Status.Success && mint !== Status.None) {
    //   console.log('mintTxId', mintTxId);
    //   console.log('mint', mint);
    //   setCurrentID(mintTxId);
    // }
  }, [lockTxId, mintTxId, lock, mint]);

  useEffect(() => {
    console.log('currentID', currentID);
  }, [currentID]);

  const explorerUrl = `${EVM_EXPLORER[currentMode]}tx/${lockTxId}`;

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
      <ShowLinkToExplorers explorerUrl={explorerUrl} currentTxID={currentID} />
    </div>
  );
}
