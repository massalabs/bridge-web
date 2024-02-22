import {
  EVM_EXPLORER,
  MASSA_EXPLORER_URL,
  MASSA_EXPLO_EXTENSION,
  MASSA_EXPLO_URL,
  sepoliaChainId,
} from '@/utils/const';
import { isEvmToMassa } from '@/utils/lambdaApi';
import { maskAddress } from '@/utils/massaFormat';

interface TxLinkToExplorersProps {
  outputTxId: `0x${string}` | null;
  evmChainId: number;
}

export function TxLinkToExplorers({ ...props }: TxLinkToExplorersProps) {
  const { outputTxId, evmChainId } = props;

  if (outputTxId === null) return;

  // hacky logic here is temporary, will need to change as it is not scalable
  // Perhaps we could get chain from api ?
  const currentMode = evmChainId === sepoliaChainId ? 'testnet' : 'mainnet';

  // if bridge operation (isEvmToMassa = true) then use EVM_EXPLORER, else use MASSA_EXPLORER
  // Current mode reflects the network, if chain id is the same as sepolia (so testnet network),
  // then current mode is testnet, else it is mainnet
  // Improvement: refactor this to fn if possible
  const explorerUrl = isEvmToMassa(outputTxId)
    ? `${EVM_EXPLORER[currentMode]}tx/${outputTxId}`
    : currentMode === 'mainnet'
    ? `${MASSA_EXPLORER_URL}${outputTxId}`
    : `${MASSA_EXPLO_URL}${outputTxId}${MASSA_EXPLO_EXTENSION}`;

  return (
    <a className="flex gap-2 items-center" href={explorerUrl} target="_blank">
      <u>{maskAddress(outputTxId)}</u>
    </a>
  );
}
