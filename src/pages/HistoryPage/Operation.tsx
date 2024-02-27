import { Tooltip } from '@massalabs/react-ui-kit';
import { EmitterOrRecipient } from './EmitterOrRecipient';
import { itemsInPage } from './HistoryPage';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { useTokenStore } from '@/store/tokenStore';
import {
  OperationHistoryItem,
  formatApiCreationTime,
} from '@/utils/bridgeHistory';
import { SIDE } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface OperationProps {
  operation: OperationHistoryItem;
}

export function Operation(props: OperationProps) {
  const { operation: op } = props;

  const { tokens } = useTokenStore();
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(op.amount);
  const symbol = tokens.find((t) => t.evmToken === op.evmToken)?.symbolEVM;

  return (
    <div className="grid grid-cols-6 mas-body2">
      <EmitterOrRecipient isMassaToEvm={op.side === SIDE.MASSA_TO_EVM} />
      <EmitterOrRecipient isMassaToEvm={op.side !== SIDE.MASSA_TO_EVM} />
      <div className="flex items-center">{formatApiCreationTime(op.time)}</div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol} <Tooltip body={amountFormattedFull} />
      </div>
      <ShowStatus status={op.status} />
      <TxLinkToExplorers outputId={op.outputId} side={op.side} />
    </div>
  );
}

export function OperationSkeleton() {
  const skeletons = Array.from({ length: itemsInPage }, (_, index) => (
    <div key={index} className="w-full h-4 bg-gray-300 rounded-xl"></div>
  ));

  return (
    <div className="grid grid-cols-6 mas-body2 animate-pulse gap-4">
      {skeletons}
    </div>
  );
}
