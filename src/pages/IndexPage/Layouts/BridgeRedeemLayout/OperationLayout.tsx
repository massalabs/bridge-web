import { useState } from 'react';
import { formatAmount, Money, Button } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { FiRepeat } from 'react-icons/fi';
import { parseUnits } from 'viem';
import { useAccount } from 'wagmi';
import { boxLayout, WarningNoEth } from '.';
import { GetTokensPopUpModal } from '@/components';
import { ServiceFeeTooltip } from '@/components/ServiceFeeTooltip/ServiceFeeTooltip';
import useEvmToken from '@/custom/bridge/useEvmToken';
import { useServiceFee } from '@/custom/bridge/useServiceFee';
import Intl from '@/i18n/i18n';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useOperationStore } from '@/store/operationStore';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { useTokenStore } from '@/store/tokenStore';
import { SIDE } from '@/utils/const';
import { getAmountToReceive, serviceFeeToPercent } from '@/utils/utils';

export function OperationLayout() {
  const { setAmountError, amountError } = useGlobalStatusesStore();

  const { tokenBalance, isFetched: isBalanceFetched } = useEvmToken();
  const { isConnected: isEvmWalletConnected } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const {
    isMassaToEvm,
    inputAmount,
    outputAmount,
    setSide,
    setInputAmount,
    setOutputAmount,
  } = useOperationStore();

  const massaToEvm = isMassaToEvm();

  const [openTokensModal, setOpenTokensModal] = useState<boolean>(false);

  const { isFetching } = useAccountStore();

  const { selectedToken: token } = useTokenStore();
  const { serviceFee } = useServiceFee();

  function handlePercent(percent: number) {
    if (!token || !isBalanceFetched) return;

    if (
      (massaToEvm && token.balance <= 0) ||
      (!massaToEvm && tokenBalance <= 0)
    ) {
      setAmountError(Intl.t('index.approve.error.insufficient-funds'));
      return;
    }

    const amount = massaToEvm
      ? formatAmount(token?.balance.toString(), token.decimals, '').full
      : formatAmount(tokenBalance.toString(), token.decimals, '').full;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(token.decimals).toFixed();

    const _amount = parseUnits(res, token.decimals);

    setInputAmount(_amount);

    const amountToReceive = getAmountToReceive(_amount, serviceFee);
    setOutputAmount(amountToReceive);
  }

  function handleToggleLayout() {
    setInputAmount(undefined);
    setOutputAmount(undefined);

    setSide(massaToEvm ? SIDE.EVM_TO_MASSA : SIDE.MASSA_TO_EVM);
  }

  function changeAmount(amount: string) {
    if (!token) return;
    if (!amount) {
      setInputAmount(undefined);

      setOutputAmount(undefined);
      return;
    }

    const parsedInputAmount = parseUnits(amount, token.decimals);
    setInputAmount(parsedInputAmount);

    if (isMassaToEvm()) {
      const amountToReceive = getAmountToReceive(parsedInputAmount, serviceFee);
      setOutputAmount(amountToReceive);
    } else {
      setOutputAmount(parsedInputAmount);
    }
  }
  return (
    <>
      <div className="p-6 bg-primary rounded-2xl mb-5">
        <p className="mb-4 mas-body">{Intl.t('index.from')}</p>
        {boxLayout().up.header}
        {boxLayout().up.wallet}
        <div className="mb-4 flex items-center gap-2">
          <div className="w-full">
            <Money
              disable={isFetching}
              name="amount"
              value={
                !inputAmount
                  ? ''
                  : formatAmount(inputAmount, token?.decimals).full
              }
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
              inputAmount={
                formatAmount(inputAmount || '0', token?.decimals).full
              }
              serviceFee={serviceFeeToPercent(serviceFee)}
              outputAmount={
                formatAmount(outputAmount || '0', token?.decimals).full
              }
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
              value={
                !outputAmount
                  ? ''
                  : formatAmount(outputAmount, token?.decimals).full
              }
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

      {openTokensModal && (
        <GetTokensPopUpModal setOpenModal={setOpenTokensModal} />
      )}
    </>
  );
}
