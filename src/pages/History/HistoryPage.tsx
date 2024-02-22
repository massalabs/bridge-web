import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { Categories } from './Categories';
import { Operation } from './Operation';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';
import { Burned, getBridgeHistory } from '@/utils/lambdaApi';

export function HistoryPage() {
  const { address: evmAddress } = useAccount();

  const [operation, setOperation] = useState<Burned>();

  // TODO: add loading state
  // TODO: add pending operations on top of list (tbd)

  // might be replaced by store
  // this is for dev purposes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBridgeHistory(evmAddress as `0x${string}`);
        setOperation(data.burned[0]);
        console.log(data);
      } catch (error) {
        console.error('Error fetching operation', error);
      }
    };
    fetchData();
  }, [evmAddress]);

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

        <div className="flex flex-col gap-8 py-4 mt-8">
          {operation && (
            <Operation operation={operation} key={operation.inputOpId} />
          )}
        </div>
      </div>
    </div>
  );
}

// Top level objectives and questions:

// TODO: []Table component (receive 1 to n operations)
// -> objective = pagination (max height) and display operation history
// TODO: []Operation component ->
// objective = display operation details, should also format and contain all logic

// Questions: if no tx id what to show ?
// How are we getting diffrent states and what does each state equate to ?
// What is the case for a failed state ? should we really display it ?
