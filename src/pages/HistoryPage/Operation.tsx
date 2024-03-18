import { Tooltip } from '@massalabs/react-ui-kit';
import { Emitter } from './Emitter';
import { Recipient } from './Recipient';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { wmasDecimals } from '../DaoPage';
import { useTokenStore } from '@/store/tokenStore';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';
import { FormattedAmount, formatAmount } from '@/utils/parseAmount';

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

  function getFormattedAmount(): FormattedAmount {
    if (op.entity === Entities.ReleaseMAS) {
      return formatAmount(op.amount, wmasDecimals);
    }
    // Default is 18 decimals
    return formatAmount(op.amount);
  }

  let { amountFormattedFull, amountFormattedPreview } = getFormattedAmount();

  const symbol = tokens.find((t) => t.evmToken === op.evmToken)?.symbolEVM;

  return (
    <div className="grid grid-cols-6 mas-body2">
      <Emitter operation={op} />
      <Recipient operation={op} />
      <div className="flex items-center">
        {formatApiCreationTime(op.createdAt)}
      </div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol} <Tooltip body={amountFormattedFull} />
      </div>
      <ShowStatus status={op.historyStatus} />
      <TxLinkToExplorers operation={op} />
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
