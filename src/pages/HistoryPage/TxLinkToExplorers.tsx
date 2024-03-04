import { useBridgeModeStore } from '@/store/store';
import { EVM_EXPLORER, MASSA_EXPLORER_URL, SIDE } from '@/utils/const';
import { maskAddress } from '@/utils/massaFormat';

interface TxLinkToExplorersProps {
  outputId?: string;
  side: string;
}

export function TxLinkToExplorers(props: TxLinkToExplorersProps) {
  const { outputId, side } = props;
  const { currentMode } = useBridgeModeStore();
  const isMassaToEvm = side === SIDE.MASSA_TO_EVM;

  if (outputId === null || outputId === undefined) return;

  // We have no way of correctly displaying a buildnet tx
  if (!isMassaToEvm && currentMode !== 'mainnet') return;

  const explorerUrl = isMassaToEvm
    ? `${EVM_EXPLORER[currentMode]}tx/${outputId}`
    : `${MASSA_EXPLORER_URL}${outputId}`;

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(outputId)}</u>
    </a>
  );
}
