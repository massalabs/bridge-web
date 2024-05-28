import { Button } from '@massalabs/react-ui-kit';
import { FiExternalLink } from 'react-icons/fi';
import { bsc, bscTestnet } from 'viem/chains';
import { SupportedEvmBlockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { isEVMTxID, openInNewTab } from '@/pages';
import { useBridgeModeStore } from '@/store/modeStore';
import { EVM_EXPLORER } from '@/utils/const';
import { maskAddress } from '@/utils/massaFormat';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

interface LinkExplorerProps {
  currentTxId: `0x${string}` | string | undefined;
  chainId: number | undefined;
  size?: 'lg' | 'md' | 'sm';
}

export function LinkExplorer(props: LinkExplorerProps) {
  const { currentTxId, chainId, size = 'sm' } = props;
  const { currentMode } = useBridgeModeStore();
  if (!currentTxId) return;

  const sizeMap = {
    lg: 6,
    md: 4,
    sm: 0,
  };

  const explorerUrl = getExplorerUrl();

  function getExplorerUrl(): string | undefined {
    if (!currentTxId || !chainId) return undefined;

    if (isEVMTxID.test(currentTxId)) {
      const explorerType =
        chainId === bsc.id || chainId === bscTestnet.id
          ? SupportedEvmBlockchain.BSC
          : SupportedEvmBlockchain.ETH;
      return `${EVM_EXPLORER[explorerType][currentMode]}${currentTxId}`;
    }

    return linkifyMassaOpIdToExplo(currentTxId);
  }

  return (
    explorerUrl && (
      <div className="flex items-center gap-2 justify-evenly">
        {size === 'lg' && (
          <div>
            {isEVMTxID.test(currentTxId)
              ? `${Intl.t('index.loading-box.transaction')}:`
              : `${Intl.t('index.loading-box.operation')}:`}
          </div>
        )}

        {(size === 'lg' || size === 'md') && (
          <div>{maskAddress(currentTxId, sizeMap[size])}</div>
        )}

        <Button variant="icon" onClick={() => openInNewTab(explorerUrl)}>
          <FiExternalLink size={18} />
        </Button>
      </div>
    )
  );
}
