import { useEffect } from 'react';
import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { useBridgeModeStore, useOperationStore } from '../../../../store/store';
import { EVM_EXPLORER, SIDE } from '../../../../utils/const';
import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';

export function ShowOperationId() {
  const { currentMode, isMainnet } = useBridgeModeStore();
  const { side, currentTxID } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  useEffect(() => {
    currentTxID && console.log('showing currentTxId:', currentTxID);
  }, [currentTxID]);

  const smartExplorerUrl = massaToEvm
    ? isMainnet
      ? `https://explorer.massa.net/operation/${currentTxID}`
      : undefined
    : EVM_EXPLORER[currentMode] + 'tx/' + currentTxID;

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    currentTxID && (
      <div className="flex align-middle items-center w-full justify-center">
        <div className="mb-1">
          {massaToEvm
            ? `${Intl.t('index.loading-box.operation')}:`
            : `${Intl.t('index.loading-box.transaction')}:`}
        </div>
        <div className="w-30">
          <Clipboard
            customClass={'bg-transparent w-20'}
            displayedContent={maskAddress(currentTxID)}
            rawContent={currentTxID}
          />
        </div>
        <div>
          {smartExplorerUrl ? (
            <Button
              variant="icon"
              onClick={() => openInNewTab(smartExplorerUrl)}
            >
              <FiExternalLink size={18} />
            </Button>
          ) : null}
        </div>
      </div>
    )
  );
}
