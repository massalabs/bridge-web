import { useEffect, useState } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { useAccount } from 'wagmi';
import { Categories } from './Categories';
import { Operation } from './Operation';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';
import { Burned, getBridgeHistory } from '@/utils/lambdaApi';

export function HistoryPage() {
  const { address: evmAddress } = useAccount();
  // containes all operations
  const [operationList, setOperationList] = useState<Burned[]>([]);

  // pagination
  const [shownOperations, setShownOperations] = useState<number[]>([0, 10]);
  const [pageStep, setPageStep] = useState<number>(0);

  // TODO: add loading state
  // TODO: add pending operations on top of list (tbd)
  // TODO: improve pagination to use steps as buttons

  // might be replaced by store
  // this is for dev purposes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBridgeHistory(evmAddress as `0x${string}`);
        const returnedData = data.burned;
        setOperationList(returnedData);
      } catch (error) {
        console.error('Error fetching operation', error);
      }
    };
    fetchData();
  }, [evmAddress]);

  function loadMore() {
    setPageStep(pageStep + 1);
    const newLowest = shownOperations[0] + 10;
    const newHighest = shownOperations[1] + 10;
    setShownOperations([newLowest, newHighest]);
  }

  function loadLess() {
    setPageStep(pageStep - 1);
    const newLowest = shownOperations[0] - 10;
    const newHighest = shownOperations[1] - 10;
    setShownOperations([newLowest, newHighest]);
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
              .slice(shownOperations[0], shownOperations[1])
              .map((op) => <Operation operation={op} key={op.inputOpId} />)}
        </div>
        <div className="flex gap-12 items-center justify-center">
          <Button
            customClass="w-64"
            disabled={pageStep <= 0}
            preIcon={<FiMinus />}
            onClick={() => {
              loadLess();
            }}
          >
            Show previous
          </Button>
          <Button
            customClass="w-64"
            posIcon={<FiPlus />}
            disabled={pageStep >= Math.ceil(operationList.length / 10 - 1)}
            onClick={() => {
              loadMore();
            }}
          >
            Show next
          </Button>
        </div>
      </div>
    </div>
  );
}

// Top level objectives and questions:

// TODO: []Table component (receive 1 to n operations) ->
// objective = pagination (max height) and display operation history
// TODO: []Operation component ->
// objective = display operation details, should also format and contain all logic

// Questions: if no tx id what to show ?
// How are we getting diffrent states and what does each state equate to ?
// What is the case for a failed state ? should we really display it ?
// Case where operations has been shown as successful but it does not have
// the three block confirmations yet = async compared to the rest of the screen
// --> success pending and success waiting for 3 confirmations
