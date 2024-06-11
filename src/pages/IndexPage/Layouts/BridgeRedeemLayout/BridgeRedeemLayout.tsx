import { useState } from 'react';
import { Button, Money, formatAmount } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { boxLayout } from './BoxLayout';
import { FeesEstimation } from './FeesEstimation';
import { WarningNoEth } from './WarningNoEth';

import { GetTokensPopUpModal } from '@/components';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import { useSubmitBridge } from '@/custom/bridge/useSubmitBridge';
import { useSubmitRedeem } from '@/custom/bridge/useSubmitRedeem';
import Intl from '@/i18n/i18n';
import { PendingOperationLayout } from '@/pages';
import { Status } from '@/store/globalStatusesStore';
import {
  useAccountStore,
  useBridgeModeStore,
  useGlobalStatusesStore,
  useOperationStore,
  useTokenStore,
} from '@/store/store';
import { SIDE } from '@/utils/const';
import { getAmountToReceive, serviceFeeToPercent } from '@/utils/utils';

interface BridgeRedeemProps {
  isBlurred: string;
  isButtonDisabled: boolean;
}

export function BridgeRedeemLayout(props: BridgeRedeemProps) {
  const { isBlurred, isButtonDisabled } = props;

  const { setAmountError, amountError } = useGlobalStatusesStore();

  const { tokenBalance: _tokenBalanceEVM, isFetched: isBalanceFetched } =
    useEvmToken();
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { box } = useGlobalStatusesStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const {
    isMassaToEvm,
    outputAmount,
    setSide,
    setOutputAmount,
    setInputAmount,
  } = useOperationStore();
  const { isFetching } = useAccountStore();

  const { selectedToken: token } = useTokenStore();
  const { serviceFee } = useServiceFee();

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  const massaToEvm = isMassaToEvm();

  const { handleSubmitBridge } = useSubmitBridge();
  const { handleSubmitRedeem } = useSubmitRedeem();

  const [localInputAmount, setLocalInputAmount] = useState<string>();

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

    setLocalInputAmount(res);
    setInputAmount(parseUnits(res, token.decimals));
    const amountToReceive = getAmountToReceive(
      res,
      serviceFee,
      token?.decimals,
    );

    setOutputAmount(
      formatAmount(amountToReceive, token.decimals).amountFormattedFull,
    );
  }

  function handleToggleLayout() {
    setLocalInputAmount(undefined);
    setInputAmount(undefined);
    setOutputAmount(undefined);
    setSide(massaToEvm ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  function handleGenericSubmit() {
    isMassaToEvm() ? handleSubmitRedeem() : handleSubmitBridge();
  }

  const isOperationPending = box !== Status.None;

  if (isOperationPending) return <PendingOperationLayout />;

  function changeAmount(amount: string) {
    if (!token) return;
    if (!amount) {
      setInputAmount(undefined);
      setLocalInputAmount(undefined);
      setOutputAmount(undefined);
      return;
    }
    setInputAmount(parseUnits(amount, token.decimals));
    setLocalInputAmount(amount);
    if (isMassaToEvm()) {
      const amountToReceive = getAmountToReceive(
        amount,
        serviceFee,
        token.decimals,
      );

      // replace trailing zeros
      setOutputAmount(
        formatAmount(
          amountToReceive,
          token.decimals,
        ).amountFormattedFull.replace(/\.?0+$/, ''),
      );
    } else {
      setOutputAmount(amount);
    }
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
                value={localInputAmount || ''}
                onValueChange={(o) => changeAmount(o.value)}
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
          {isMassaToEvm() ? (
            <div className="flex items-center mb-4 gap-2">
              <p className="mas-body">
                {Intl.t('index.input.placeholder.receive')}
              </p>
              <ServiceFeeTooltip
                inputAmount={localInputAmount}
                serviceFee={serviceFeeToPercent(serviceFee)}
                outputAmount={outputAmount}
                symbol={token?.symbol || ''}
              />
            </div>
          ) : (
            <p className="mb-4 mas-body">{Intl.t('index.to')}</p>
          )}
          {boxLayout().down.header}
          {boxLayout().down.wallet}
          <div className="mb-4 flex items-center gap-2">
            <div className="w-full">
              <Money
                placeholder={Intl.t('index.input.placeholder.receive')}
                name="receive"
                value={outputAmount || ''}
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
          <Button disabled={isButtonDisabled} onClick={handleGenericSubmit}>
            {massaToEvm
              ? Intl.t('index.button.redeem')
              : Intl.t('index.button.bridge')}
          </Button>
        </div>
        <FeesEstimation />
      </div>

      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
