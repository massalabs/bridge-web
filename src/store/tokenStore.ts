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
  selectedToken?: IToken;
  tokens: IToken[];
  isFetching: boolean;

  setSelectedToken: (token?: IToken) => void;
  getTokens: (connectedAccount?: IAccount) => void;
  refreshBalances: (connectedAccount?: IAccount) => void;
}

let massaClient: Client | null = null;

async function initMassaClient(): Promise<Client> {
  return ClientFactory.createDefaultClient(
    DefaultProviderUrls.BUILDNET,
    CHAIN_ID[BUILDNET],
  );
}

export const useTokenStore = create<TokenStoreState>((set, get) => ({
  selectedToken: undefined,
  tokens: [],
  isFetching: false,

  getTokens: async (connectedAccount?: IAccount) => {
    set({ isFetching: true });

    if (!massaClient) {
      massaClient = await initMassaClient();
    }

    const supportedTokens = await getSupportedTokensList(massaClient);

    const tokens = await Promise.all(
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
            getAllowance(tokenPair.massaToken, massaClient!, connectedAccount),
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

    const storedToken = _getFromStorage(BRIDGE_TOKEN)
      ? JSON.parse(_getFromStorage(BRIDGE_TOKEN))
      : undefined;

    const selectedToken = tokens.find(
      (token) => token.massaToken === storedToken?.massaToken,
    );

    set({ tokens, isFetching: false });
    get().setSelectedToken(selectedToken);
  },

  setSelectedToken: (selectedToken?: IToken) => {
    set({ selectedToken });
    _setInStorage(BRIDGE_TOKEN, JSON.stringify(selectedToken));
  },

  refreshBalances: async (connectedAccount?: IAccount) => {
    const { tokens: supportedTokens } = get();

    if (!connectedAccount) {
      return;
    }

    if (!massaClient) {
      massaClient = await initMassaClient();
    }

    set({ isFetching: true });

    const tokens = await Promise.all(
      supportedTokens.map(async (token) => {
        const [accountAllowance, accountBalance] = await Promise.all([
          getAllowance(token.massaToken, massaClient!, connectedAccount),
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
