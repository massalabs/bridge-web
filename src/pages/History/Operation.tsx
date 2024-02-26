import { Tooltip } from '@massalabs/react-ui-kit';
import { Emitter } from './Emitter';
import { Recipient } from './Recipient';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { useTokenStore } from '@/store/tokenStore';
import { OperationHistoryItem, formatApiCreationTime } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

interface OperationProps {
  operation: OperationHistoryItem;
}

export function Operation({ ...props }: OperationProps) {
  const { operation: op } = props;

  const { tokens } = useTokenStore();
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(op.amount);
  const symbol = tokens.find((t) => t.evmToken === op.evmToken)?.symbolEVM;

  return (
    <div className="grid grid-cols-6 mas-body2">
      <Emitter side={op.side} />
      <Recipient side={op.side} />
      <div className="flex items-center">{formatApiCreationTime(op.time)}</div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol} <Tooltip body={amountFormattedFull} />
      </div>
      <ShowStatus status={op.status} />
      <TxLinkToExplorers
        outputId={op.outputId}
        isOpOnMainnet={op.isOpOnMainnet}
        side={op.side}
      />
    </div>
  );
}
