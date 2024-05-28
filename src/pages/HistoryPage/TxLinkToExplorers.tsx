import { bsc, bscTestnet } from 'viem/chains';
import { SupportedEvmBlockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';
import { EVM_EXPLORER } from '@/utils/const';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';
import { TX_CHAR_LIMIT, maskAddress } from '@/utils/massaFormat';
import { linkifyMassaOpIdToExplo } from '@/utils/utils';

interface TxLinkToExplorersProps {
  operation: OperationHistoryItem;
}

export function TxLinkToExplorers(props: TxLinkToExplorersProps) {
  const { operation } = props;
  const { currentMode } = useBridgeModeStore();

  if (operation.outputId === null || operation.outputId === undefined) return;

  const txHash = operation.outputId;
  const chainID = operation.evmChainId;

  function getEvmExplorerUrl(): string {
    if (!txHash || !chainID) return '';

    if (chainID === bsc.id || chainID === bscTestnet.id) {
      return `${
        EVM_EXPLORER[SupportedEvmBlockchain.BSC][currentMode]
      }${txHash}`;
    }

    return `${EVM_EXPLORER[SupportedEvmBlockchain.ETH][currentMode]}${txHash}`;
  }

  const massaExplorer = linkifyMassaOpIdToExplo(operation.outputId);

  function getExplorerUrl() {
    switch (operation.entity) {
      case Entities.ReleaseMAS:
      case Entities.Lock:
        return massaExplorer;
      case Entities.Burn:
        return getEvmExplorerUrl();
    }
  }

  const explorerUrl = getExplorerUrl();

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(operation.outputId, TX_CHAR_LIMIT)}</u>
    </a>
  );
}
