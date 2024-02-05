import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { useBridgeModeStore, useOperationStore } from '../../../../store/store';
import { SIDE } from '../../../../utils/const';
import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';

interface ShowOperationIdProps {
  explorerUrl: string;
}

export function ShowLinkToExplorers(props: ShowOperationIdProps) {
  const { explorerUrl } = props;
  const { side, currentTxID } = useOperationStore();
  const massaToEvm = side === SIDE.MASSA_TO_EVM;

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
          {/* TBD if this is necessary */}
          {operationId && explorerUrl ? (
            <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
              <FiExternalLink size={18} />
            </Button>
          ) : null}
        </div>
      </div>
    )
  );
}
