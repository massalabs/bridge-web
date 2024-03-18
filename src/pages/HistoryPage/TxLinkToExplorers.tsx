import { useBridgeModeStore } from '@/store/store';
import {
  EVM_EXPLORER,
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
} from '@/utils/const';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';
import { TX_CHAR_LIMIT, maskAddress } from '@/utils/massaFormat';

interface TxLinkToExplorersProps {
  operation: OperationHistoryItem;
}

export function TxLinkToExplorers(props: TxLinkToExplorersProps) {
  const { operation } = props;
  const { currentMode, isMainnet: getIsMainnet } = useBridgeModeStore();

  if (operation.outputId === null || operation.outputId === undefined) return;

  const isMainnet = getIsMainnet();

  const evmExplorer = `${EVM_EXPLORER[currentMode]}tx/${operation.outputId}`;

  const massaExplorerUrl = `${MASSA_EXPLORER_URL}${operation.outputId}`;

  const massaExploUrl = `${MASSA_EXPLO_URL}${operation.outputId}${MASSA_EXPLO_EXTENSION}`;

  const massaExplorer = isMainnet ? massaExplorerUrl : massaExploUrl;

  function getExplorerUrl() {
    switch (operation.entity) {
      case Entities.ReleaseMAS:
      case Entities.Lock:
        return massaExplorer;
      case Entities.Burn:
        return evmExplorer;
    }
  }

  const explorerUrl = getExplorerUrl();

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(operation.outputId, TX_CHAR_LIMIT)}</u>
    </a>
  );
}
