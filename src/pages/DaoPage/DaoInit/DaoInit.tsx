import { SyntheticEvent } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiArrowRight } from 'react-icons/fi';
import { DaoHead } from './DaoHead';
import { DaoMiddle } from './DaoMiddle';
import Intl from '@/i18n/i18n';

interface DaoInitProps {
  amount: string;
  setAmount: (value: string) => void;
  amountError: string | undefined;
  fetchingBalance: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
}

export function DaoInit(props: DaoInitProps) {
  const { amount, setAmount, amountError, fetchingBalance, handleSubmit } =
    props;
  return (
    <>
      <DaoHead
        amount={amount}
        setAmount={setAmount}
        amountError={amountError}
      />
      <DaoMiddle amount={amount} />
      <Button
        disabled={fetchingBalance}
        onClick={(e) => handleSubmit(e)}
        posIcon={<FiArrowRight />}
      >
        {Intl.t('index.loading-box.bridge')}
      </Button>
    </>
  );
}
