import { useCallback, useEffect, useState } from 'react';
import {
  ChainId,
  IQuoter,
  LB_QUOTER_ADDRESS,
  PairV2,
  RouteV2,
  USDC as _USDC,
  WMAS as _WMAS,
  WETH as _WETH,
  TradeV2,
  TokenAmount,
} from '@dusalabs/sdk';
import { formatAmount } from '@massalabs/react-ui-kit';
import { useDebounceValue } from 'usehooks-ts';
import { useBridgeModeStore } from '../../store/modeStore';
import {
  useAccountStore,
  useOperationStore,
  useTokenStore,
} from '../../store/store';
import { useMassaNetworkValidation } from '../bridge/useNetworkValidation';

export function useUsdValue() {
  const { isMainnet, currentMode } = useBridgeModeStore();
  const { inputAmount } = useOperationStore();
  const [debouncedAmount] = useDebounceValue(inputAmount, 300);
  const { massaClient } = useAccountStore();
  const { selectedToken } = useTokenStore();
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
      setUsdValue('0');
      return;
    }
    setIsFetching(true);
    const symbol = selectedToken.symbolEVM.toUpperCase();
    let outputAmount: string;
    if (symbol.includes('USD') || symbol.includes('DAI')) {
      outputAmount = formatAmount(
        debouncedAmount,
        selectedToken.decimals,
      ).preview;
    } else {
      const chainId = isMainnet() ? ChainId.MAINNET : ChainId.BUILDNET;
      const USDC = _USDC[chainId];
      const ETH = _WETH[chainId];
      const WMAS = _WMAS[chainId];

      // little hack because Dusa buildnet doesn't use same token addresses as Bridge
      const inputToken = symbol.includes('ETH') ? ETH : WMAS;
      const outputToken = USDC;

      const allTokenPairs = PairV2.createAllTokenPairs(
        inputToken,
        outputToken,
        [ETH, USDC, WMAS],
      );

      const allPairs = PairV2.initPairs(allTokenPairs);

      if (!allPairs) {
        console.warn('No pairs found');
        setIsFetching(false);
        setUsdValue('0');
        return;
      }

      // generates all possible routes to consider
      const allRoutes = RouteV2.createAllRoutes(
        allPairs,
        inputToken,
        outputToken,
        3, // maxHops
      );

      // generates all possible TradeV2 instances
      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        new TokenAmount(inputToken, debouncedAmount),
        outputToken,
        false,
        false,
        massaClient,
        chainId,
      );

      // chooses the best trade
      let bestTrade;

      try {
        bestTrade = TradeV2.chooseBestTrade(trades, true);
      } catch (error) {
        console.warn('No best trade found');
        setIsFetching(false);
        setUsdValue('0');
        return;
      }

      const quoter = new IQuoter(LB_QUOTER_ADDRESS[chainId], massaClient);

      const prices = await quoter.findBestPathFromAmountIn(
        bestTrade.route.pathToStrArr(),
        debouncedAmount.toString(),
      );

      if (!prices.virtualAmountsWithoutSlippage[2]) {
        console.warn('No slippage amount found');
        setIsFetching(false);
        return;
      }
      // get the output amount without slippage
      outputAmount = formatAmount(
        prices.virtualAmountsWithoutSlippage[
          prices.virtualAmountsWithoutSlippage.length - 1
        ],
        outputToken.decimals,
      ).preview;
    }

    console.log('outputAmount', outputAmount);
    setUsdValue(outputAmount);
    setIsFetching(false);
  }, [debouncedAmount, massaClient, isMainnet, inputAmount]);

  useEffect(() => {
    getUsdValue();
  }, [getUsdValue, currentMode, selectedToken]);

  return { usdValue, isFetching };
}