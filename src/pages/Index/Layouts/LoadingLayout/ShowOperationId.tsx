import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import { useBridgeModeStore } from '../../../../store/store';
import { EVM_EXPLORER } from '../../../../utils/const';
import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';

interface ShowOperationIdProps {
  operationId: string;
  massaToEvm: boolean;
}

export function ShowOperationId(props: ShowOperationIdProps) {
  const { operationId, massaToEvm } = props;

  const [currentMode, isMainnet] = useBridgeModeStore((state) => [
    state.currentMode,
    state.isMainnet,
  ]);

  const smartExplorerUrl = massaToEvm
    ? isMainnet
      ? `https://explorer.massa.net/operation/${operationId}`
      : undefined
    : EVM_EXPLORER[currentMode] + 'tx/' + operationId;

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    operationId && (
      <div className="flex align-middle items-center w-full justify-center">
        <div className="mb-1">
          {massaToEvm
            ? `${Intl.t('index.loading-box.operation')}:`
            : `${Intl.t('index.loading-box.transaction')}:`}
        </div>
        <div className="w-30">
          <Clipboard
            customClass={'bg-transparent w-20'}
            displayedContent={maskAddress(operationId)}
            rawContent={operationId}
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
