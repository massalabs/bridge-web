import { useCallback, useEffect, useState } from 'react';
import { formatAmount } from '@massalabs/react-ui-kit';
import { useDebounceValue } from 'usehooks-ts';
import { formatUnits, parseUnits } from 'viem';
import { useBridgeModeStore } from '../../store/modeStore';
import { useAccountStore } from '../../store/store';
import { useMassaNetworkValidation } from '../bridge/useNetworkValidation';
import { IToken } from '@/store/tokenStore';

export function useUsdValue(
  inputAmount: bigint | undefined,
  selectedToken: IToken | undefined,
) {
  const { currentMode } = useBridgeModeStore();

  const [debouncedAmount] = useDebounceValue(inputAmount, 300);
  const { massaClient } = useAccountStore();

  const isValidMassaNetwork = useMassaNetworkValidation();
  const [usdValue, setUsdValue] = useState<string>();
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const getUsdValue = useCallback(async () => {
    if (
      !selectedToken ||
      !debouncedAmount ||
      !massaClient ||
      !inputAmount ||
      !isValidMassaNetwork
    ) {
      setIsFetching(false);
      setUsdValue(undefined);
      return;
    }
    setIsFetching(true);

    try {
      const symbol = selectedToken.symbolEVM.toUpperCase();
      let outputAmount = undefined;

      if (symbol.includes('USD') || symbol.includes('DAI')) {
        outputAmount = formatAmount(
          debouncedAmount,
          selectedToken.decimals,
        ).preview;
      } else {
        let binanceSymbol;
        if (symbol.includes('BTC')) {
          binanceSymbol = 'BTC';
        } else if (symbol.includes('ETH')) {
          binanceSymbol = 'ETH';
        } else {
          console.warn('Unsupported token for price fetch:', symbol);
        }

        if (binanceSymbol) {
          const data = await fetch(
            `https://api.binance.com/api/v3/ticker/price?symbol=${binanceSymbol}USDT`,
          );
          const priceData = await data.json();
          const priceFloat = parseFloat(priceData.price);
          const amount = Number(
            formatUnits(debouncedAmount, selectedToken.decimals),
          );
          const outputUSDAmount = (amount * priceFloat).toFixed(2);
          outputAmount = formatAmount(
            parseUnits(outputUSDAmount, selectedToken.decimals),
            selectedToken.decimals,
          ).preview;
        }
      }
      setUsdValue(outputAmount);
    } catch (error) {
      console.error('Error in USD value calculation:', error);
      setUsdValue(undefined);
    } finally {
      setIsFetching(false);
    }
  }, [
    debouncedAmount,
    massaClient,
    inputAmount,
    isValidMassaNetwork,
    selectedToken,
  ]);

  useEffect(() => {
    getUsdValue();
  }, [getUsdValue, currentMode, selectedToken]);

  return { usdValue, isFetching };
}
