import { useEffect, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { Categories } from './Categories';
import { Operation, OperationSkeleton } from './Operation';
import { Hr } from '@/components/Hr';
import { config } from '@/const';
import { useResource } from '@/custom/api/useResource';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

import { OperationHistoryItem, lambdaEndpoint } from '@/utils/lambdaApi';

export const itemsInPage = 8;

export function HistoryPage() {
  const { address: evmAddress } = useAccount();
  const { currentMode } = useBridgeModeStore();
  const { connectedAccount } = useAccountStore();

  const massaAddress = connectedAccount?.address();
  /* eslint-disable max-len */
  const lambdaUrl = `${config[currentMode].lambdaUrl}${lambdaEndpoint}?evmAddress=${evmAddress}&massaAddress=${massaAddress}`;

  const { data: lambdaResponse, isFetching } =
    useResource<OperationHistoryItem[]>(lambdaUrl);

  // contains all operations to render
  const [operationList, setOperationList] = useState<OperationHistoryItem[]>(
    [],
  );

  // pagination
  const [shownOperations, setShownOperations] = useState<{
    low: number;
    high: number;
  }>({
    low: 0,
    high: itemsInPage,
  });
  const [pageStep, setPageStep] = useState<number>(0);

  useEffect(() => {
    if (lambdaResponse) {
      setOperationList(lambdaResponse);
      return;
    } else {
      setOperationList([]);
      return;
    }
  }, [lambdaResponse]);

  function loadOldest() {
    setPageStep(pageStep + 1);
    const newLowest = shownOperations.low + itemsInPage;
    const newHighest = shownOperations.high + itemsInPage;
    setShownOperations({ low: newLowest, high: newHighest });
  }

  function loadNewest() {
    setPageStep(pageStep - 1);
    const newLowest = shownOperations.low - itemsInPage;
    const newHighest = shownOperations.high - itemsInPage;
    setShownOperations({ low: newLowest, high: newHighest });
  }

  const historyOperations = operationList
    .slice(shownOperations.low, shownOperations.high)
    .map((op) => <Operation operation={op} key={op.inputId} />);

  const skeleton = Array(itemsInPage)
    .fill(0)
    .map((_, index) => <OperationSkeleton key={index} />);

  if (!evmAddress) return skeleton;

  function renderHistory() {
    if (isFetching) {
      return skeleton;
    }
    if (operationList.length === 0) {
      return (
        <p className="mas-menu-active text-info text-2xl">
          {Intl.t('history.no-history', { address: evmAddress as string })}
        </p>
      );
    }
    return historyOperations;
  }

  return (
    <div className="flex h-fit w-screen items-center justify-center p-10">
      <div
        className="bg-secondary/50 text-f-primary border-tertiary flex w-[90%] flex-col justify-between
        rounded-2xl border px-16 py-12 backdrop-blur-lg"
      >
        <div
          className="mas-subtitle mb-12
          flex justify-center"
        >
          {Intl.t('history.title')}
        </div>

        <Hr />
        <Categories />
        <Hr />

        <div className="mb-4 mt-8 flex flex-col gap-8 py-4 h-[600px]">
          {renderHistory()}
        </div>
        <div className="flex items-center justify-center gap-12">
          <Button
            variant="secondary"
            customClass="w-64"
            disabled={pageStep <= 0}
            preIcon={<FiMinus />}
            onClick={loadNewest}
          >
            {Intl.t('history.show-recent')}
          </Button>
          <Button
            customClass="w-64"
            variant="secondary"
            posIcon={<FiPlus />}
            disabled={pageStep >= Math.ceil(operationList.length / 10 - 1)}
            onClick={loadOldest}
          >
            {Intl.t('history.show-previous')}
          </Button>
        </div>
      </div>
    </div>
  );
}
