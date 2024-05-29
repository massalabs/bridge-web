import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { useBridgeModeStore } from '@/store/modeStore';
import { useOperationStore } from '@/store/operationStore';
import { EVM_EXPLORER } from '@/utils/const';
import { TX_CHAR_LIMIT, maskAddress } from '@/utils/massaFormat';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

interface ShowBridgeLinkExplorer {
  currentTxID: string | undefined;
}

export const isEVMTxID = /^0x/i;

export const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer');
};

export function BridgeLinkExplorer(props: ShowBridgeLinkExplorer) {
  const { currentTxID } = props;
  const { currentMode } = useBridgeModeStore();
  const { selectedEvm } = useOperationStore();

  function getExplorerUrl(): string {
    if (!currentTxID) return '';
    if (!isEVMTxID.test(currentTxID)) {
      return linkifyMassaOpIdToExplo(currentTxID);
    }

    return `${EVM_EXPLORER[selectedEvm][currentMode]}${currentTxID}`;
  }

  let explorerUrl = getExplorerUrl();

  const showLinkToExplorers = currentTxID && explorerUrl;

  return (
    showLinkToExplorers && (
      <div className="flex align-middle items-center w-full justify-center">
        <div className="flex justify-center items-center w-fit h-fit">
          {isEVMTxID.test(currentTxID)
            ? `${Intl.t('index.loading-box.transaction')}:`
            : `${Intl.t('index.loading-box.operation')}:`}

          <div className="w-32">
            <Clipboard
              customClass={'bg-transparent w-20'}
              displayedContent={maskAddress(currentTxID, TX_CHAR_LIMIT)}
              rawContent={currentTxID}
            />
          </div>

          <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
            <FiExternalLink size={18} />
          </Button>
        </div>
      </div>
    )
  );
}
