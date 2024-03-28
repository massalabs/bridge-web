import { SyntheticEvent } from 'react';
import { Button } from '@massalabs/react-ui-kit';
import { FiArrowRight } from 'react-icons/fi';
import { DaoHead } from './DaoHead';
import { DaoMiddle } from './DaoMiddle';
import {
  ChainContext,
  useEvmChainValidation,
  useMassaNetworkValidation,
} from '@/custom/bridge/useNetworkValidation';
import Intl from '@/i18n/i18n';
import { useAccountStore } from '@/store/store';

interface DaoInitProps {
  amount: string;
  setAmount: (value: string) => void;
  setAmountError: (value: string) => void;
  amountError: string | undefined;
  fetchingBalance: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
  wmasBalance: bigint;
}

export function DaoInit(props: DaoInitProps) {
  const {
    amount,
    setAmount,
    amountError,
    fetchingBalance,
    handleSubmit,
    wmasBalance,
    setAmountError,
  } = props;

  const { connectedAccount, isFetching } = useAccountStore();

  const isValidEvmNetwork = useEvmChainValidation(ChainContext.DAO);
  const isValidMassaNetwork = useMassaNetworkValidation();

  const isButtonDisabled =
    fetchingBalance ||
    !connectedAccount ||
    !isValidEvmNetwork ||
    !isValidMassaNetwork ||
    isFetching;

  return (
    <>
      <DaoHead
        amount={amount}
        setAmount={setAmount}
        amountError={amountError}
        setAmountError={setAmountError}
        wmasBalance={wmasBalance}
        fetchingBalance={fetchingBalance}
      />
      <DaoMiddle amount={amount} />
      <Button
        disabled={isButtonDisabled}
        onClick={(e) => handleSubmit(e)}
        posIcon={<FiArrowRight />}
      >
        {Intl.t('index.loading-box.bridge')}
      </Button>
    </>
  );
}
