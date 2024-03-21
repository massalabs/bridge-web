import { Button, Clipboard } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { TX_CHAR_LIMIT, maskAddress } from '@/utils/massaFormat';

interface ShowLinkToExplorers {
  explorerUrl: string;
  currentTxID: string | undefined;
}

export const isEVMTxID = /^0x/i;

export const openInNewTab = (url: string) => {
  window.open(url, '_blank', 'noreferrer');
};

export function ShowLinkToExplorers(props: ShowLinkToExplorers) {
  const { explorerUrl, currentTxID } = props;

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
