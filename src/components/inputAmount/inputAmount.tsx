import { Money, formatAmount } from '@massalabs/react-ui-kit';
import Big from 'big.js';
import { parseUnits } from 'viem';
import useEvmToken from '../../custom/bridge/useEvmToken';
import { useMassaNetworkValidation } from '../../custom/bridge/useNetworkValidation';
import { useServiceFee } from '../../custom/bridge/useServiceFee';
import { useUsdValue } from '../../custom/usdPrice/useFetchPrice';
import { TokenBalance, TokenOptions } from '../../pages';
import { useGlobalStatusesStore } from '../../store/globalStatusesStore';
import { useOperationStore } from '../../store/operationStore';
import { useTokenStore } from '../../store/tokenStore';
import Intl from '@/i18n/i18n';
import { getAmountToReceive } from '@/utils/utils';

export interface InputAmountProps {
  isInput: boolean;
  massaTokens: boolean;
}

export const InputAmount = (props: InputAmountProps) => {
  const { isInput, massaTokens } = props;
  const { inputAmount, outputAmount, setAmounts, isMassaToEvm } =
    useOperationStore.getState();

  const { serviceFee } = useServiceFee();
  const { selectedToken } = useTokenStore();
  const { tokenBalance: _tokenBalanceEVM, isFetched: isBalanceFetched } =
    useEvmToken();
  const { setAmountError, amountError } = useGlobalStatusesStore();
  // Price are fetched onchain from Dusa. If massa network is not valid, we don't show the price
  const isValidMassaNetwork = useMassaNetworkValidation();

  const massaToEvm = isMassaToEvm();
  const decimals = selectedToken?.decimals;

  const { usdValue } = useUsdValue(
    isInput ? inputAmount : outputAmount,
    selectedToken,
  );

  function changeAmount(amount: string) {
    if (!isInput || !selectedToken) {
      return;
    }
    if (!amount) {
      setAmounts(undefined, undefined);
      return;
    }
    setAmountError(undefined);

    const newAmount = parseUnits(amount, decimals!);

    const receivedAmount = getAmountToReceive(newAmount, serviceFee);
    setAmounts(newAmount, receivedAmount);
  }

  function handlePercent(percent: number) {
    if (!selectedToken || !isBalanceFetched) return;

    if (
      (massaToEvm && selectedToken.balance <= 0) ||
      (!massaToEvm && _tokenBalanceEVM <= 0)
    ) {
      setAmountError(Intl.t('index.approve.error.insufficient-funds'));
      return;
    }

    const amount = massaToEvm
      ? formatAmount(selectedToken?.balance.toString(), decimals, '').full
      : formatAmount(_tokenBalanceEVM.toString(), decimals, '').full;

    const x = new Big(amount);
    const y = new Big(percent);
    const res = x.times(y).round(decimals).toFixed();

    changeAmount(res);
  }

  let displayedAmount = '';
  if (isInput && inputAmount) {
    displayedAmount = formatAmount(inputAmount || '0', decimals).full;
  }
  if (!isInput && outputAmount) {
    displayedAmount = formatAmount(outputAmount || '0', decimals).full;
  }

  return (
    <div className="w-full">
      <div className="flex justify-between default-input border-0 pl-2 pr-10 mt-2 mb-1">
        <div className="flex flex-col items-left gap-2 mt-4">
          <div className="w-full">
            <Money
              disable={!isInput}
              name={isInput ? 'amount' : 'receive'}
              value={displayedAmount}
              onValueChange={(o) => changeAmount(o.value)}
              placeholder={Intl.t(
                isInput
                  ? 'index.input.placeholder.amount'
                  : 'index.input.placeholder.receive',
              )}
              suffix=""
              decimalScale={decimals}
              error={isInput ? amountError : ''}
            />
          </div>
          {isValidMassaNetwork && !!inputAmount && !!usdValue && (
            <div className="pl-4 mb-1">USD {usdValue}</div>
          )}
        </div>
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-full">
            <TokenOptions nativeToken={massaTokens} />
          </div>
          {isInput && (
            <div className="w-full mb-2">
              <TokenBalance />
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-4">
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
  );
};
