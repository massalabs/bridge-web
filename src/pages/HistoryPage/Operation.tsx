import { Tooltip } from '@massalabs/react-ui-kit';
import { Emitter } from './Emitter';
import { Recipient } from './Recipient';
import { ShowStatus } from './ShowStatus';
import { TxLinkToExplorers } from './TxLinkToExplorers';
import { wmasDecimals, wmasSymbol } from '../DaoPage';
import { useTokenStore } from '@/store/tokenStore';
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

  function getTokenInfo() {
    if (op.entity === Entities.ReleaseMAS) {
      return { symbol: wmasSymbol, tokenDecimals: wmasDecimals };
    }
    const token = tokens.find((t) => t.evmToken === op.evmToken);

    return { symbol: token?.symbolEVM, tokenDecimals: token?.decimals };
  }

  const { symbol, tokenDecimals } = getTokenInfo();

  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    op.amount,
    tokenDecimals,
  );

  return (
    <div className="grid grid-cols-6 mas-body2">
      <Emitter operation={op} />
      <Recipient operation={op} />
      <div className="flex items-center">
        {formatApiCreationTime(op.createdAt)}
      </div>
      <div className="flex items-center">
        {amountFormattedPreview} {symbol}{' '}
        <Tooltip body={`${amountFormattedFull} ${symbol}`} />
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
