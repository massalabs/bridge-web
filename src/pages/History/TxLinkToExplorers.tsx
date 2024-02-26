import { EVM_EXPLORER, MASSA_EXPLORER_URL, SIDE } from '@/utils/const';
import { maskAddress } from '@/utils/massaFormat';

interface TxLinkToExplorersProps {
  outputId: string | null | undefined;
  isOpOnMainnet: boolean;
  side: string;
}

export function TxLinkToExplorers({ ...props }: TxLinkToExplorersProps) {
  const { outputId, isOpOnMainnet, side } = props;

  if (outputId === null || outputId === undefined) return;

  const currentMode = isOpOnMainnet ? 'testnet' : 'mainnet';

  const explorerUrl =
    side === SIDE.MASSA_TO_EVM
      ? `${EVM_EXPLORER[currentMode]}tx/${outputId}`
      : `${MASSA_EXPLORER_URL}${outputId}`;

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(outputId)}</u>
    </a>
  );
}
