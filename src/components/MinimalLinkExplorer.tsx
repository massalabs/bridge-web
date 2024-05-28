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

interface MinimalLinkExplorerProps {
  currentTxId: `0x${string}` | string | undefined;
  chainId: number | undefined;
  size?: 'lg' | 'md' | 'sm';
}

export function MinimalLinkExplorer(props: MinimalLinkExplorerProps) {
  const { currentTxId, chainId, size = 'sm' } = props;
  const { currentMode } = useBridgeModeStore();
  if (!currentTxId) return;

  function getMaskAddressDisplaySize() {
    const sizeMap = {
      lg: 6,
      md: 4,
      sm: 0,
    };
    return sizeMap[size];
  }

  function getExplorerUrl(): string | undefined {
    if (!currentTxId || !chainId) return undefined;
    if (isEVMTxID.test(currentTxId)) {
      if (chainId === bsc.id || chainId === bscTestnet.id) {
        return `${
          EVM_EXPLORER[SupportedEvmBlockchain.BSC][currentMode]
        }${currentTxId}`;
      } else {
        return `${
          EVM_EXPLORER[SupportedEvmBlockchain.ETH][currentMode]
        }${currentTxId}`;
      }
    } else return linkifyMassaOpIdToExplo(currentTxId);
  }

  const evmExplorer = getExplorerUrl();

  return (
    evmExplorer && (
      <div className="flex items-center gap-2 justify-evenly">
        {size === 'lg' && (
          <div>
            {isEVMTxID.test(currentTxId)
              ? `${Intl.t('index.loading-box.transaction')}:`
              : `${Intl.t('index.loading-box.operation')}:`}
          </div>
        )}

        {(size === 'lg' || size === 'md') && (
          <div>{maskAddress(currentTxId, getMaskAddressDisplaySize())}</div>
        )}

        <Button variant="icon" onClick={() => openInNewTab(evmExplorer)}>
          <FiExternalLink size={18} />
        </Button>
      </div>
    )
  );
}
