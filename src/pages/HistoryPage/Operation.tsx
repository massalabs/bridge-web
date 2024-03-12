import { Tooltip } from '@massalabs/react-ui-kit';
import { EmitterOrRecipient } from './EmitterOrRecipient';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { useTokenStore } from '@/store/tokenStore';
import { SIDE } from '@/utils/const';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';
import { formatAmount } from '@/utils/parseAmount';

function formatApiCreationTime(inputTimestamp: string) {
  const dateObject = new Date(inputTimestamp);
  return dateObject.toLocaleString(navigator.language);
}
interface OperationProps {
  operation: OperationHistoryItem;
}

export function Operation(props: OperationProps) {
  const { operation: op } = props;

  const { tokens } = useTokenStore();
  let { amountFormattedFull, amountFormattedPreview } = formatAmount(op.amount);
  const symbol = tokens.find((t) => t.evmToken === op.evmToken)?.symbolEVM;
  const isMassaToEvm = op.entity === Entities.Burn;
  const side = isMassaToEvm ? SIDE.MASSA_TO_EVM : SIDE.EVM_TO_MASSA;

  return (
    <div className="grid grid-cols-6 mas-body2">
      <EmitterOrRecipient isMassaToEvm={isMassaToEvm} />
      <EmitterOrRecipient isMassaToEvm={!isMassaToEvm} />
      <div className="flex items-center">
        {formatApiCreationTime(op.createdAt)}
      </div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol} <Tooltip body={amountFormattedFull} />
      </div>
      <ShowStatus status={op.historyStatus} />
      <TxLinkToExplorers outputId={op.outputId} side={side} />
    </div>
  );
}

export function OperationSkeleton() {
  const numberOfCols = 6;
  const skeletons = Array.from({ length: numberOfCols }, (_, index) => (
    <div key={index} className="w-full h-4 bg-gray-300 rounded-xl"></div>
  ));

  return (
    <div className="grid grid-cols-6 mas-body2 animate-pulse gap-4">
      {skeletons}
    </div>
  );
}
