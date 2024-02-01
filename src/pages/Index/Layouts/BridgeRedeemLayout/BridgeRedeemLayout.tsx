import { useState } from 'react';

import { Button, Money } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { useAccount } from 'wagmi';

import { boxLayout } from './BoxLayout';
import { WarningNoEth } from './WarningNoEth';
import { GetTokensPopUpModal } from '@/components';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface BridgeRedeemArgs {
  isBlurred: string;
  isButtonDisabled: boolean;
  amount: string | undefined;
  decimals: number;
  error: any;
  setAmount: (state: string) => void;
  setError: (state: { amount: string } | null) => void;
  handleSubmit: (e: any) => void;
  handleToggleLayout: () => void;
}

export function BridgeRedeemLayout({ ...args }: BridgeRedeemArgs) {
  const {
    isBlurred,
    isButtonDisabled,
    amount,
    decimals,
    error,
    setAmount,
    setError,
    handleSubmit,
    handleToggleLayout,
  } = args;

  const { tokenBalance: _tokenBalanceEVM } = useEvmBridge();
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { isMainnet } = useBridgeModeStore();
  const { side } = useOperationStore();
  const [isFetching] = useAccountStore((state) => [state.isFetching]);
  const [token] = useTokenStore((state) => [state.selectedToken]);

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  const massaToEvm = side === SIDE.MASSA_TO_EVM;

  function handlePercent(percent: number) {
    if (!token) return;

    if (
      (massaToEvm && token.balance <= 0) ||
      (!massaToEvm && _tokenBalanceEVM <= 0)
    ) {
      setError({ amount: Intl.t('index.approve.error.insufficient-funds') });
      return;
    }

    const amount = massaToEvm
      ? formatAmount(token?.balance.toString(), decimals, '').full
      : formatAmount(_tokenBalanceEVM.toString(), decimals, '').full;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(decimals).toFixed();

    setAmount(res);
  }

  // Money component formats amount without decimals
  return (
    <>
      <div
        className={`p-10 max-w-3xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5 ${isBlurred}`}
      >
        <div className="p-6 bg-primary rounded-2xl mb-5">
          <p className="mb-4 mas-body">{Intl.t('index.from')}</p>
          {boxLayout().up.header}
          {boxLayout().up.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Money
                disable={isFetching}
                name="amount"
                value={amount}
                onValueChange={(o) => setAmount(o.value)}
                placeholder={Intl.t('index.input.placeholder.amount')}
                suffix=""
                decimalScale={decimals}
                error={error?.amount}
              />
              <div className="flex flex-row-reverse">
                <ul className="flex flex-row mas-body2">
                  <li
                    onClick={() => handlePercent(0.25)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    25%
                  </li>
                  <li
                    onClick={() => handlePercent(0.5)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    50%
                  </li>
                  <li
                    onClick={() => handlePercent(0.75)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    75%
                  </li>
                  <li
                    onClick={() => handlePercent(1)}
                    className="mr-3.5 hover:cursor-pointer"
                  >
                    Max
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-1/3 mb-4">{boxLayout().up.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {!isMainnet && isEvmWalletConnected && (
                <h3
                  className="mas-h3 text-f-disabled-1 underline cursor-pointer"
                  onClick={() => setOpenTokensModal(true)}
                >
                  {Intl.t(`index.get-tokens`)}
                </h3>
              )}
            </div>
            {boxLayout().up.balance}
          </div>
        </div>
        <div className="mb-5 flex justify-center items-center">
          <Button
            disabled={isFetching}
            variant="toggle"
            onClick={handleToggleLayout}
            customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
              massaToEvm ? 'rotate-180' : ''
            }`}
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">{Intl.t('index.to')}</p>
          {boxLayout().down.header}
          {boxLayout().down.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Money
                placeholder={Intl.t('index.input.placeholder.receive')}
                name="receive"
                value={amount}
                onValueChange={(o) => setAmount(o.value)}
                suffix=""
                decimalScale={decimals}
                error=""
                disable={true}
              />
            </div>
            <div className="w-1/3">{boxLayout().down.token}</div>
          </div>
          <WarningNoEth />
        </div>
        <div>
          <Button disabled={isButtonDisabled} onClick={(e) => handleSubmit(e)}>
            {massaToEvm
              ? Intl.t('index.button.redeem')
              : Intl.t('index.button.bridge')}
          </Button>
        </div>
      </div>

      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
