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
import { useAccountStore } from '../../store/store';
import { IToken } from '../../store/tokenStore';

export const useUsdValue = (amount?: bigint, token?: IToken) => {
  const { isMainnet } = useBridgeModeStore();
  const [usdValue, setUsdValue] = useState<string>();
  const [debouncedAmount] = useDebounceValue(amount, 300);
  const { massaClient } = useAccountStore();

  const getUsdValue = useCallback(async () => {
    if (!token || !debouncedAmount || !massaClient) {
      return;
    }

    const symbol = token.symbolEVM.toUpperCase();
    let outputAmount: string;
    if (symbol.includes('USD') || symbol.includes('DAI')) {
      outputAmount = formatAmount(debouncedAmount, token.decimals).preview;
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
      const bestTrade = TradeV2.chooseBestTrade(trades, true);

      const quoter = new IQuoter(LB_QUOTER_ADDRESS[chainId], massaClient);

      const prices = await quoter.findBestPathFromAmountIn(
        bestTrade.route.pathToStrArr(),
        debouncedAmount.toString(),
      );
      // get the output amount without slippage
      outputAmount = formatAmount(
        prices.virtualAmountsWithoutSlippage[2],
        outputToken.decimals,
      ).preview;
    }

    setUsdValue(outputAmount);
  }, [debouncedAmount, token, massaClient, isMainnet]);

  useEffect(() => {
    getUsdValue();
  }, [getUsdValue]);

  return { usdValue };
};
