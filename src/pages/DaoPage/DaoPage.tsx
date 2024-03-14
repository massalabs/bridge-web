import { useState, SyntheticEvent } from 'react';
import { parseUnits } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { DaoProcessing } from '.';
import { DaoInit } from './DaoInit/DaoInit';
import { config } from '@/const';
import { useBurnWMAS } from '@/custom/bridge/useBurnWmas';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

// Might not need to hardcode as balance fetch can give me this info
export const wmasDecimals = 9;
export const wmasSymbol = 'WMAS';

export enum ReleaseMasStatus {
  init = 'initialising',
  burning = 'burning',
  burnSuccess = 'burnSuccess',
  releasing = 'releasing',
  releaseSuccess = 'releaseSuccess',
}

// TODO: complete processing success logic
// Keeping comments as reference

export function DaoPage() {
  const { address: evmAddress } = useAccount();
  const { write, isBurnSuccess, burnHash } = useBurnWMAS();
  const { connectedAccount } = useAccountStore();
  const { currentMode } = useBridgeModeStore();
  const massaAddress = connectedAccount?.address();
  const { data: wmasBalance, isFetching: fetchingBalance } = useBalance({
    address: evmAddress,
    token: config[currentMode].wmas_address,
  });

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>('');
  const [releaseMasStatus, setReleaseMasStatus] = useState<ReleaseMasStatus>(
    ReleaseMasStatus.init,
  );

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!wmasBalance || !massaAddress) return;
    if (!validateWmas(amount, wmasBalance.value, setAmountError) || !amount)
      return;
    write(parseUnits(amount, wmasDecimals), massaAddress);
    setReleaseMasStatus(ReleaseMasStatus.burning);
  }

  // still not sure about this
  function updateReleaseMasStep(step: ReleaseMasStatus) {
    setReleaseMasStatus(step);
  }

  function renderReleaseMasStatus(status: ReleaseMasStatus) {
    switch (status) {
      case ReleaseMasStatus.burning:
      case ReleaseMasStatus.burnSuccess:
      case ReleaseMasStatus.releasing:
        return (
          <DaoProcessing
            updateReleaseMasStep={updateReleaseMasStep}
            isBurnSuccess={isBurnSuccess}
            burnHash={burnHash}
            releaseMasStatus={releaseMasStatus}
          />
        );
      default:
        return (
          <>
            <DaoInit
              amount={amount}
              amountError={amountError}
              setAmount={setAmount}
              fetchingBalance={fetchingBalance}
              handleSubmit={handleSubmit}
            />
          </>
        );
      // case ReleaseMasStatus.releaseSuccess:
      //   return <DaoSuccessLayout />;
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 p-10 max-w-3xl 
            w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5`}
    >
      {renderReleaseMasStatus(releaseMasStatus)}
    </div>
  );
}

function validateWmas(
  amount: string,
  _balance: bigint,
  setAmountError: (value: string) => void,
): boolean {
  const _amount = parseUnits(amount, 9);
  if (_amount <= 0n) {
    setAmountError(Intl.t('index.approve.error.invalid-amount'));
    return false;
  }
  if (_balance < _amount) {
    setAmountError(Intl.t('index.approve.error.insufficient-funds'));
    return false;
  }
  return true;
}
