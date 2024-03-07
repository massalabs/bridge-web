import { useBridgeModeStore } from '@/store/store';
import {
  EVM_EXPLORER,
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
  SIDE,
} from '@/utils/const';
import { maskAddress } from '@/utils/massaFormat';

interface TxLinkToExplorersProps {
  outputId?: string;
  side: string;
}

export function TxLinkToExplorers(props: TxLinkToExplorersProps) {
  const { outputId, side } = props;
  const { currentMode, isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMassaToEvm = side === SIDE.MASSA_TO_EVM;

  if (outputId === null || outputId === undefined) return;

  const isMainnet = getIsMainnet();

  const evmExplorer = `${EVM_EXPLORER[currentMode]}tx/${outputId}`;

  function getExplorerUrl() {
    if (isMainnet) {
      return isMassaToEvm ? evmExplorer : `${MASSA_EXPLORER_URL}${outputId}`;
    }
    return isMassaToEvm
      ? evmExplorer
      : `${MASSA_EXPLO_URL}${outputId}${MASSA_EXPLO_EXTENSION}`;
  }

  const explorerUrl = getExplorerUrl();

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(outputId)}</u>
    </a>
  );
}
