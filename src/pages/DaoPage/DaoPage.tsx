import { useState, SyntheticEvent } from 'react';
import { erc20Abi, parseUnits } from 'viem';
import { useAccount, useReadContracts } from 'wagmi';
import { DaoProcessing } from '.';
import { DaoInit } from './DaoInit/DaoInit';
import { config } from '@/const';
import { useBurnWMAS } from '@/custom/bridge/useBurnWmas';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export const wmasDecimals = 9;
export const wmasSymbol = 'WMAS';

export enum ReleaseMasStatus {
  init = 'init',
  burning = 'burning',
  releasing = 'releasing',
  releaseSuccess = 'releaseSuccess',
  error = 'error',
}

export function DaoPage() {
  const { address: evmAddress } = useAccount();
  const { write, isBurnSuccess, burnHash, isBurnWriteError, resetBurnWrite } =
    useBurnWMAS();
  const { connectedAccount } = useAccountStore();
  const { currentMode } = useBridgeModeStore();
  const massaAddress = connectedAccount?.address();
  const tokenContract = {
    address: config[currentMode].wmas_address,
    abi: erc20Abi,
  };

  const { data, isFetching } = useReadContracts({
    contracts: [
      {
        ...tokenContract,
        functionName: 'balanceOf',
        args: [evmAddress || '0x'],
      },
    ],
    query: {
      enabled: !!evmAddress,
    },
  });

  const wmasBalance = data?.[0].status === 'success' ? data[0].result : 0n;

  const [amount, setAmount] = useState('');
  const [amountError, setAmountError] = useState<string | undefined>('');
  const [releaseMasStatus, setReleaseMasStatus] = useState<ReleaseMasStatus>(
    ReleaseMasStatus.init,
  );

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    if (!wmasBalance || !massaAddress) return;
    if (!validateWmas(amount, wmasBalance, setAmountError) || !amount) return;
    write(parseUnits(amount, wmasDecimals), massaAddress);
    setReleaseMasStatus(ReleaseMasStatus.burning);
  }

  function renderReleaseMasStatus(status: ReleaseMasStatus) {
    switch (status) {
      case ReleaseMasStatus.burning:
      case ReleaseMasStatus.releasing:
      case ReleaseMasStatus.releaseSuccess:
        return (
          <DaoProcessing
            resetBurnWrite={resetBurnWrite}
            setReleaseMasStatus={setReleaseMasStatus}
            isBurnSuccess={isBurnSuccess}
            isBurnWriteError={isBurnWriteError}
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
              setAmountError={setAmountError}
              setAmount={setAmount}
              fetchingBalance={isFetching}
              wmasBalance={wmasBalance}
              handleSubmit={handleSubmit}
            />
          </>
        );
    }
  }

  return (
    <div
      className={`flex flex-col gap-4 p-10 max-w-[800px] 
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
