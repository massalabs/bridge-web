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
import { formatUnits, parseUnits } from 'viem';
import { useBridgeModeStore } from '../../store/modeStore';
import { useAccountStore } from '../../store/store';
import { useMassaNetworkValidation } from '../bridge/useNetworkValidation';
import { IToken } from '@/store/tokenStore';

export function useUsdValue(
  inputAmount: bigint | undefined,
  selectedToken: IToken | undefined,
) {
  const { isMainnet, currentMode } = useBridgeModeStore();

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
    const symbol = selectedToken.symbolEVM.toUpperCase();
    let outputAmount: string;
    if (symbol.includes('USD') || symbol.includes('DAI')) {
      outputAmount = formatAmount(
        debouncedAmount,
        selectedToken.decimals,
      ).preview;
    }
    if (symbol.includes('BTC')) {
      const btcPriceRes = await fetch(
        'https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT',
      );
      const btcPriceData = await btcPriceRes.json();
      const btcPrice = parseFloat(btcPriceData.price);
      const amount = Number(
        formatUnits(debouncedAmount, selectedToken.decimals),
      );
      const outputUSDAmount = (amount * btcPrice).toFixed(2);
      outputAmount = formatAmount(
        parseUnits(outputUSDAmount, selectedToken.decimals),
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

      // generates all possible routes to consider
      const allRoutes = RouteV2.createAllRoutes(
        allPairs,
        inputToken,
        outputToken,
        3, // maxHops
      );

      // Get price for 1 input token
      const trades = await TradeV2.getTradesExactIn(
        allRoutes,
        new TokenAmount(inputToken, parseUnits('1', inputToken.decimals)),
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
        setUsdValue(undefined);
        setIsFetching(false);
        return;
      }

      const quoter = new IQuoter(LB_QUOTER_ADDRESS[chainId], massaClient);

      const prices = await quoter.findBestPathFromAmountIn(
        bestTrade.route.pathToStrArr(),
        parseUnits('1', inputToken.decimals).toString(),
      );

      // get the output amount without slippage
      const unitPrice =
        prices.virtualAmountsWithoutSlippage[
          prices.virtualAmountsWithoutSlippage.length - 1
        ];

      // Multiply by the actual amount and format
      outputAmount = formatAmount(
        formatUnits(unitPrice * debouncedAmount, inputToken.decimals)
          // remove decimal part (floor)
          .replace(/\..+$/g, ''),
        outputToken.decimals,
      ).preview;
    }

    setUsdValue(outputAmount);
    setIsFetching(false);
  }, [
    debouncedAmount,
    massaClient,
    isMainnet,
    inputAmount,
    isValidMassaNetwork,
    selectedToken,
  ]);

  useEffect(() => {
    getUsdValue();
  }, [getUsdValue, currentMode, selectedToken]);

  return { usdValue, isFetching };
}
