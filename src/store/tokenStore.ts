/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  BUILDNET,
  CHAIN_ID,
  Client,
  ClientFactory,
  DefaultProviderUrls,
} from '@massalabs/massa-web3';
import { IAccount } from '@massalabs/wallet-provider';
import { create } from 'zustand';

import { getSupportedTokensList } from '@/custom/bridge/bridge';
import {
  getAllowance,
  getMassaTokenSymbol,
  getDecimals,
  getMassaTokenName,
  getBalance,
} from '@/custom/token/token';
import { BRIDGE_TOKEN } from '@/utils/const';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

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
  token: IToken | null;
  tokens: IToken[];
  isFetching: boolean;

  setToken: (token: IToken | null) => void;
  setAvailableTokens: (tokens: IToken[]) => void;
  getTokens: (connectedAccount: IAccount | null) => void;
}

let massaClient: Client | null = null;

async function initMassaClient(): Promise<Client> {
  return ClientFactory.createDefaultClient(
    DefaultProviderUrls.BUILDNET,
    CHAIN_ID[BUILDNET],
  );
}

export const useTokenStore = create<TokenStoreState>((set, get) => ({
  tokens: [],
  token: null,
  isFetching: false,

  setAvailableTokens: (tokens: IToken[]) => {
    set({ tokens: tokens });
  },

  getTokens: async (connectedAccount: IAccount | null) => {
    set({ isFetching: true });

    if (massaClient === null) {
      massaClient = await initMassaClient();
    }

    const storedToken = _getFromStorage(BRIDGE_TOKEN)
      ? JSON.parse(_getFromStorage(BRIDGE_TOKEN))
      : undefined;

    if (massaClient && connectedAccount) {
      const supportedTokens = await getSupportedTokensList(massaClient);

      const tokens: IToken[] = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals, allowance, balance] =
            await Promise.all([
              getMassaTokenName(tokenPair.massaToken, massaClient!),
              getMassaTokenSymbol(tokenPair.massaToken, massaClient!),
              getDecimals(tokenPair.massaToken, massaClient!),
              getAllowance(
                tokenPair.massaToken,
                massaClient!,
                connectedAccount,
              ),
              getBalance(tokenPair.massaToken, massaClient!, connectedAccount),
            ]);
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

      const selectedToken = tokens.find(
        (token: IToken) => token.name === storedToken?.name,
      );
      const token = tokens.length ? selectedToken || tokens[0] : null;

      set({ tokens, isFetching: false });
      get().setToken(token);
    }
  },

  setToken: (token: IToken | null) => {
    set({ token });
    _setInStorage(BRIDGE_TOKEN, JSON.stringify(token));
  },
}));
