import { useState } from 'react';

import { Button, Money } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { useAccount } from 'wagmi';

import { boxLayout } from './BoxLayout';
import { GetTokensPopUpModal } from '@/components';
import { LayoutType } from '@/const';
import useEvmBridge from '@/custom/bridge/useEvmBridge';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useTokenStore,
} from '@/store/store';
import { formatAmount } from '@/utils/parseAmount';

interface BridgeRedeemArgs {
  isBlurred: string;
  IS_MASSA_TO_EVM: boolean;
  isButtonDisabled: boolean;
  layout: LayoutType | undefined;
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
    IS_MASSA_TO_EVM,
    isButtonDisabled,
    layout,
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
  const [isMainnet] = useBridgeModeStore((state) => [state.isMainnet]);
  const [isFetching] = useAccountStore((state) => [state.isFetching]);
  const [token] = useTokenStore((state) => [state.selectedToken]);

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  function handlePercent(percent: number) {
    if (!token) return;

    if (
      (IS_MASSA_TO_EVM && token.balance <= 0) ||
      (!IS_MASSA_TO_EVM && _tokenBalanceEVM <= 0)
    ) {
      setError({ amount: Intl.t('index.approve.error.insufficient-funds') });
      return;
    }

    const amount = IS_MASSA_TO_EVM
      ? formatAmount(token?.balance.toString(), decimals, '').full
      : formatAmount(_tokenBalanceEVM.toString(), decimals, '').full;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(decimals).toFixed();

    setAmount(res);
  }

  return (
    <>
      <div
        className={`p-10 max-w-2xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5 ${isBlurred}`}
      >
        <div className="p-6 bg-primary rounded-2xl mb-5">
          <p className="mb-4 mas-body">{Intl.t('index.from')}</p>
          {boxLayout(layout).up.header}
          {boxLayout(layout).up.wallet}
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
            <div className="w-1/3 mb-4">{boxLayout(layout).up.token}</div>
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
            {boxLayout(layout).up.balance}
          </div>
        </div>
        <div className="mb-5 flex justify-center items-center">
          <Button
            disabled={isFetching}
            variant="toggle"
            onClick={handleToggleLayout}
            customClass={`w-12 h-12 inline-block transition ease-in-out delay-10 ${
              IS_MASSA_TO_EVM ? 'rotate-180' : ''
            }`}
          >
            <FiRepeat size={24} />
          </Button>
        </div>
        <div className="mb-5 p-6 bg-primary rounded-2xl">
          <p className="mb-4 mas-body">{Intl.t('index.to')}</p>
          {boxLayout(layout).down.header}
          {boxLayout(layout).down.wallet}
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
            <div className="w-1/3">{boxLayout(layout).down.token}</div>
          </div>
          <div className="flex justify-between items-center">
            <br />
            {boxLayout(layout).down.balance}
          </div>
        </div>
        <div>
          <Button disabled={isButtonDisabled} onClick={(e) => handleSubmit(e)}>
            {IS_MASSA_TO_EVM
              ? Intl.t('index.button.redeem')
              : Intl.t('index.button.bridge')}
          </Button>
        </div>
      </div>

      {openTokensModal && (
        <GetTokensPopUpModal
          setOpenModal={setOpenTokensModal}
          layout={layout}
        />
      )}
    </>
  );
}
