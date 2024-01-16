/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BUILDNET,
  CHAIN_ID,
  Client,
  ClientFactory,
  DefaultProviderUrls,
  MAINNET,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { create } from 'zustand';

import { BridgeMode, config } from '../const';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import {
  getAllowance,
  getMassaTokenSymbol,
  getDecimals,
  getMassaTokenName,
  getBalance,
} from '@/custom/token/token';
import {
  SELECTED_MASSA_TOKEN_KEY,
  _getFromStorage,
  _setInStorage,
} from '@/utils/storage';

export interface IToken {
  name: string;
  allowance: bigint;
  decimals: number;
  symbol: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
  balance: bigint;
}

export interface TokenStoreState {
  selectedToken?: IToken;
  tokens: IToken[];
  isFetching: boolean;
  currentBridgeMode: BridgeMode;

  setSelectedToken: (token?: IToken) => void;
  getTokens: (bridgeMode: BridgeMode, connectedAccount?: IAccount) => void;
  refreshBalances: (
    bridgeMode: BridgeMode,
    connectedAccount?: IAccount,
  ) => void;
}

let massaClient: Client | null = null;

async function initMassaClient(bridgeMode: BridgeMode): Promise<Client> {
  return ClientFactory.createDefaultClient(
    bridgeMode == BridgeMode.mainnet
      ? DefaultProviderUrls.MAINNET
      : DefaultProviderUrls.BUILDNET,
    bridgeMode == BridgeMode.mainnet ? CHAIN_ID[MAINNET] : CHAIN_ID[BUILDNET],
  );
}

export const useTokenStore = create<TokenStoreState>((set, get) => ({
  currentBridgeMode: BridgeMode.mainnet,
  selectedToken: undefined,
  tokens: [],
  isFetching: false,

  getTokens: async (bridgeMode: BridgeMode, connectedAccount?: IAccount) => {
    const { currentBridgeMode } = get();

    if (!massaClient || currentBridgeMode !== bridgeMode) {
      massaClient = await initMassaClient(bridgeMode);
    }

    set({ isFetching: true, currentBridgeMode: bridgeMode });

    let tokenList: IToken[] = [];
    try {
      const supportedTokens = await getSupportedTokensList(
        bridgeMode,
        massaClient,
      );

      tokenList = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals] = await Promise.all([
            getMassaTokenName(tokenPair.massaToken, massaClient!),
            getMassaTokenSymbol(tokenPair.massaToken, massaClient!),
            getDecimals(tokenPair.massaToken, massaClient!),
          ]);
          let allowance = BigInt(0);
          let balance = BigInt(0);
          if (connectedAccount) {
            const [accountAllowance, accountBalance] = await Promise.all([
              getAllowance(
                config[bridgeMode].massaBridgeContract,
                tokenPair.massaToken,
                massaClient!,
                connectedAccount,
              ),
              getBalance(tokenPair.massaToken, massaClient!, connectedAccount),
            ]);
            allowance = accountAllowance;
            balance = accountBalance;
          }
          return {
            ...tokenPair,
            name,
            symbol,
            decimals,
            allowance,
            balance,
          };
        }),
      );
    } catch (e) {
      console.warn('unable to get supported tokens list', e);
    }

    const storedToken = _getFromStorage(SELECTED_MASSA_TOKEN_KEY)
      ? JSON.parse(_getFromStorage(SELECTED_MASSA_TOKEN_KEY))
      : undefined;

    const selectedToken = tokenList.find(
      (token) => token.massaToken === storedToken?.massaToken,
    );

    set({ tokens: tokenList, isFetching: false });
    get().setSelectedToken(selectedToken);
  },

  setSelectedToken: (selectedToken?: IToken) => {
    set({ selectedToken });
    _setInStorage(
      SELECTED_MASSA_TOKEN_KEY,
      selectedToken ? JSON.stringify(selectedToken) : '',
    );
  },

  refreshBalances: async (
    bridgeMode: BridgeMode,
    connectedAccount?: IAccount,
  ) => {
    const { tokens: supportedTokens, currentBridgeMode } = get();

    if (!connectedAccount) {
      return;
    }

    if (!massaClient || currentBridgeMode !== bridgeMode) {
      massaClient = await initMassaClient(bridgeMode);
    }

    set({ isFetching: true, currentBridgeMode: bridgeMode });

    const tokens = await Promise.all(
      supportedTokens.map(async (token) => {
        const [accountAllowance, accountBalance] = await Promise.all([
          getAllowance(
            config[bridgeMode].massaBridgeContract,
            token.massaToken,
            massaClient!,
            connectedAccount,
          ),
          getBalance(token.massaToken, massaClient!, connectedAccount),
        ]);
        token.allowance = accountAllowance;
        token.balance = accountBalance;
        return token;
      }),
    );
    set({ tokens, isFetching: false });
  },
}));
