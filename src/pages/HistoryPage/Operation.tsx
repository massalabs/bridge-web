import { useMemo } from 'react';
import { formatAmount } from '@massalabs/react-ui-kit';
// import { bsc, bscTestnet } from 'viem/chains';
import { Amount } from './Amount';
import { Emitter } from './Emitter';
import { Recipient } from './Recipient';
import { ShowStatus } from './ShowStatus';
import { wmasDecimals, wmasSymbol } from '../DaoPage';
import { LinkExplorer } from '@/components/LinkExplorer';
import { MASSA_TOKEN } from '@/const';
import { useTokenStore } from '@/store/tokenStore';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';

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

  const memoizedStatusComponent = useMemo(() => {
    return <ShowStatus status={op.historyStatus} />;
  }, [op.historyStatus]);

  function getTokenInfo() {
    const token = tokens.find((t) => t.evmToken === op.evmToken);
    if (op.entity === Entities.ReleaseMAS) {
      return {
        sentSymbol: wmasSymbol,
        receivedSymbol: MASSA_TOKEN,
        tokenDecimals: wmasDecimals,
      };
    } else if (op.entity === Entities.Lock) {
      return {
        sentSymbol: token?.symbolEVM,
        receivedSymbol: token?.symbol,
        tokenDecimals: token?.decimals,
      };
    }
    return {
      sentSymbol: token?.symbol,
      receivedSymbol: token?.symbolEVM,
      tokenDecimals: token?.decimals,
    };
  }

  const { sentSymbol, receivedSymbol, tokenDecimals } = getTokenInfo();

  let { amountFormattedFull, amountFormattedPreview } = formatAmount(
    op.amount,
    tokenDecimals,
  );

  return (
    <div className={`grid grid-cols-7 mas-body2`}>
      <Emitter operation={op} />
      <Recipient operation={op} />
      <div className="flex items-center">
        {formatApiCreationTime(op.createdAt)}
      </div>
      {/* sent */}
      <Amount
        amountFormattedFull={amountFormattedFull}
        amountFormattedPreview={amountFormattedPreview}
        symbol={sentSymbol}
      />
      {/* received */}
      <Amount
        amountFormattedFull={amountFormattedFull}
        amountFormattedPreview={amountFormattedPreview}
        symbol={receivedSymbol}
      />
      {memoizedStatusComponent}
      <LinkExplorer
        currentTxId={op.outputId}
        chainId={op.evmChainId}
        size="md"
      />
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
