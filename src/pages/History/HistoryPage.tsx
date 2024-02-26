import { useEffect, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { Categories } from './Categories';
import { Operation } from './Operation';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';
import {
  OperationHistoryItem,
  getBridgeHistory,
  mergeBurnAndLock,
} from '@/utils/lambdaApi';

export function HistoryPage() {
  const { address: evmAddress } = useAccount();

  // containes all operations to render
  const [operationList, setOperationList] = useState<OperationHistoryItem[]>(
    [],
  );

  // pagination
  const [shownOperations, setShownOperations] = useState<{
    low: number;
    high: number;
  }>({
    low: 0,
    high: 10,
  });
  const [pageStep, setPageStep] = useState<number>(0);

  // TODO: add pending operations on top of list (tbd)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBridgeHistory(evmAddress as `0x${string}`);
        const mergedData = mergeBurnAndLock(data.burned, data.locked);
        setOperationList(mergedData);
      } catch (error) {
        console.error('Error fetching operation', error);
      }
    };
    fetchData();
  }, [evmAddress]);

  function loadOldest() {
    setPageStep(pageStep + 1);
    const newLowest = shownOperations.low + 10;
    const newHighest = shownOperations.high + 10;
    setShownOperations({ low: newLowest, high: newHighest });
  }

  function loadNewest() {
    setPageStep(pageStep - 1);
    const newLowest = shownOperations.low - 10;
    const newHighest = shownOperations.high - 10;
    setShownOperations({ low: newLowest, high: newHighest });
  }

  return (
    <div className="flex w-screen h-fit p-10 items-center justify-center">
      <div
        className="flex flex-col w-[80%] px-16 py-12 bg-secondary/50 
        backdrop-blur-lg text-f-primary border border-tertiary rounded-2xl"
      >
        <div
          className="mas-subtitle flex 
          justify-center mb-12"
        >
          {Intl.t('history.title')}
        </div>

        <Hr />
        <Categories />
        <Hr />

        <div className="flex flex-col gap-8 py-4 mt-8 mb-8">
          {operationList &&
            operationList
              .slice(shownOperations.low, shownOperations.high)
              .map((op) => <Operation operation={op} />)}
        </div>
        <div className="flex gap-12 items-center justify-center">
          <Button
            customClass="w-64"
            disabled={pageStep <= 0}
            preIcon={<FiMinus />}
            onClick={() => {
              loadNewest();
            }}
          >
            {Intl.t('history.show-recent')}
          </Button>
          <Button
            customClass="w-64"
            posIcon={<FiPlus />}
            disabled={pageStep >= Math.ceil(operationList.length / 10 - 1)}
            onClick={() => {
              loadOldest();
            }}
          >
            {Intl.t('history.show-previous')}
          </Button>
        </div>
      </div>
    </div>
  );
}

// TODO: add skeleton loading
