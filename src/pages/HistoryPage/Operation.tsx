import { useMemo } from 'react';
import { Emitter } from './Emitter';
import { Received } from './Received';
import { Recipient } from './Recipient';
import { Sent } from './Sent';
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
  const { operation } = props;

  const { tokens } = useTokenStore();

  const memoizedStatusComponent = useMemo(() => {
    return <ShowStatus status={operation.historyStatus} />;
  }, [operation.historyStatus]);

  function getTokenInfo() {
    const token = tokens.find((t) => t.evmToken === operation.evmToken);
    if (operation.entity === Entities.ReleaseMAS) {
      return {
        sentSymbol: wmasSymbol,
        receivedSymbol: MASSA_TOKEN,
        tokenDecimals: wmasDecimals,
      };
    } else if (operation.entity === Entities.Lock) {
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

  return (
    <div className={'grid grid-cols-7 mas-body2'}>
      <Emitter operation={operation} />
      <Recipient operation={operation} />
      <div className="flex items-center">
        {formatApiCreationTime(operation.createdAt)}
      </div>
      {/* sent */}
      <Sent
        amount={operation.amount}
        symbol={sentSymbol}
        decimals={tokenDecimals}
      />
      {/* received */}
      <Received
        inputAmount={operation.amount}
        outputAmount={operation.outputAmount}
        symbol={receivedSymbol}
        decimals={tokenDecimals}
      />
      {memoizedStatusComponent}
      <LinkExplorer
        currentTxId={operation.outputId}
        chainId={operation.evmChainId}
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
