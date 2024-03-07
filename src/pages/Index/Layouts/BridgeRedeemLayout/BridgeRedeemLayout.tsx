import { SyntheticEvent, useState } from 'react';

import { Button, Money } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { boxLayout } from './BoxLayout';
import { FeesEstimation } from './FeesEstimation';
import { WarningNoEth } from './WarningNoEth';
import { GetTokensPopUpModal } from '@/components';
import { PAGES } from '@/const';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useIsBscConnected } from '@/custom/bridge/useIsBscConnected';
import Intl from '@/i18n/i18n';
import {
  useAccountStore,
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';
import { formatAmount } from '@/utils/parseAmount';

interface BridgeRedeemProps {
  isBlurred: string;
  isButtonDisabled: boolean;
  handleSubmit: (e: SyntheticEvent) => void;
}

export function BridgeRedeemLayout(props: BridgeRedeemProps) {
  const { isBlurred, isButtonDisabled, handleSubmit } = props;

  const { setAmountError, amountError } = useGlobalStatusesStore();

  const { tokenBalance: _tokenBalanceEVM, isFetched: isBalanceFetched } =
    useEvmToken();
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const { isMassaToEvm, amount, setSide, setAmount } = useOperationStore();
  const { isFetching } = useAccountStore();
  const { selectedToken: token } = useTokenStore();

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  const massaToEvm = isMassaToEvm();

  function handlePercent(percent: number) {
    if (!token || !isBalanceFetched) return;

    if (
      (massaToEvm && token.balance <= 0) ||
      (!massaToEvm && _tokenBalanceEVM <= 0)
    ) {
      setAmountError(Intl.t('index.approve.error.insufficient-funds'));
      return;
    }

    const amount = massaToEvm
      ? formatAmount(token?.balance.toString(), token.decimals, '')
          .amountFormattedFull
      : formatAmount(_tokenBalanceEVM.toString(), token.decimals, '')
          .amountFormattedFull;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(token.decimals).toFixed();

    setAmount(res);
  }

  function handleToggleLayout() {
    setAmount('');
    setSide(massaToEvm ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  const isBscConnected = useIsBscConnected();

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
                decimalScale={token?.decimals}
                error={amountError}
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
                  {Intl.t('index.get-tokens')}
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
                decimalScale={token?.decimals}
                error=""
                disable={true}
              />
            </div>
            <div className="w-1/3">{boxLayout().down.token}</div>
          </div>
          <WarningNoEth />
        </div>
        <div className="mb-5">
          <Button disabled={isButtonDisabled} onClick={(e) => handleSubmit(e)}>
            {massaToEvm
              ? Intl.t('index.button.redeem')
              : Intl.t('index.button.bridge')}
          </Button>
        </div>
        {isBscConnected ? (
          <div className="text-s-warning">
            {Intl.t('dao-maker.dao-bridge-redeem-warning')}{' '}
            <Link to={PAGES.DAO}>
              <u>{Intl.t('dao-maker.page-name')} </u>
            </Link>
          </div>
        ) : (
          <FeesEstimation />
        )}
      </div>

      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
