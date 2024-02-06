import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { useOperationStore } from '@/store/store';
import { maskAddress } from '@/utils/massaFormat';

interface ShowLinkToExplorers {
  explorerUrl: string;
}

export function ShowLinkToExplorers(props: ShowLinkToExplorers) {
  const { explorerUrl } = props;
  const { currentTxID } = useOperationStore();

  const openInNewTab = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  const isEVMTxID = /^0x/i;

  const showLinkToEpxlorers = currentTxID && explorerUrl;

  return (
    showLinkToEpxlorers && (
      <div className="flex align-middle items-center w-full justify-center">
        <div className="flex justify-center items-center w-fit h-fit">
          {isEVMTxID.test(currentTxID)
            ? `${Intl.t('index.loading-box.transaction')}:`
            : `${Intl.t('index.loading-box.operation')}:`}

          <div className="w-32">
            <Clipboard
              customClass={'bg-transparent w-20'}
              displayedContent={maskAddress(currentTxID)}
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
