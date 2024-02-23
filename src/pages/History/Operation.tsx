import { Tooltip } from '@massalabs/react-ui-kit';
import { RecipientEmitter } from './RecipientEmitter';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { useTokenStore } from '@/store/tokenStore';
import { Burned, formatApiCreationTime } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface operationProps {
  operation: Burned;
}

export function Operation({ ...props }: operationProps) {
  const { operation: op } = props;
  const { tokens } = useTokenStore();

  let { amountFormattedFull, amountFormattedPreview } = formatAmount(op.amount);

  const symbol = tokens.find((t) => t.evmToken === op.evmToken)?.symbolEVM;

  return (
    <div className="grid grid-cols-6 mas-body2">
      <RecipientEmitter address={op.emitter} />
      <RecipientEmitter address={op.recipient} />
      <div className="flex items-center">
        {formatApiCreationTime(op.createdAt)}
      </div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol} <Tooltip body={amountFormattedFull} />
      </div>
      <ShowStatus
        isConfirmed={op.isConfirmed}
        outputConfirmations={op.outputConfirmations}
        outputTxId={op.outputTxId}
        error={op.error}
        state={op.state}
      />
      <TxLinkToExplorers
        outputTxId={op.outputTxId}
        evmChainId={op.evmChainId}
      />
    </div>
  );
}
