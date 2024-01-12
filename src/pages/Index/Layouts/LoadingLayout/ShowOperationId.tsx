import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';

import Intl from '@/i18n/i18n';
import { maskAddress } from '@/utils/massaFormat';

interface ShowOperationIdProps {
  operationId: string;
  massaToEvm: boolean;
}

export function ShowOperationId(props: ShowOperationIdProps) {
  const { operationId, massaToEvm } = props;

  const smartExplorerUrl = massaToEvm
    ? `https://explorer.massa.net/operation/${operationId}`
    : `https://sepolia.etherscan.io/tx/${operationId}`;

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
          <Button variant="icon" onClick={() => openInNewTab(smartExplorerUrl)}>
            <FiExternalLink size={18} />
          </Button>
        </div>
      </div>
    )
  );
}
