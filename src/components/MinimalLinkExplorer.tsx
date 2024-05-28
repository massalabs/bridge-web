import { Button } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';
import Intl from '@/i18n/i18n';
import { isEVMTxID, openInNewTab } from '@/pages';
import { maskAddress } from '@/utils/massaFormat';

interface MinimalLinkExplorerProps {
  currentTxID: `0x${string}` | string | undefined;
  explorerUrl: string;
  size?: 'md' | 'sm';
}

export function MinimalLinkExplorer(props: MinimalLinkExplorerProps) {
  const { currentTxID, explorerUrl, size = 'sm' } = props;
  if (!currentTxID) return;
  return (
    <div className="flex items-center gap-2 justify-evenly">
      {size === 'md' && (
        <>
          {isEVMTxID.test(currentTxID)
            ? `${Intl.t('index.loading-box.transaction')}:`
            : `${Intl.t('index.loading-box.operation')}:`}
          <div>{maskAddress(currentTxID)}</div>
        </>
      )}
      <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
        <FiExternalLink size={18} />
      </Button>
    </div>
  );
}
