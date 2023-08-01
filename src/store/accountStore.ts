/* eslint-disable @typescript-eslint/no-explicit-any */
import { ClientFactory, DefaultProviderUrls } from '@massalabs/massa-web3';
import {
  providers,
  IAccount,
  IAccountBalanceResponse,
  IProvider,
} from '@massalabs/wallet-provider';

import { MASSA_STATION } from '@/const';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import {
  getAllowance,
  getMassaTokenSymbol,
  getDecimals,
  getMassaTokenName,
  getBalance,
} from '@/custom/token/token';

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

export interface AccountStoreState {
  account: IAccount | null;
  accounts: IAccount[];
  token: IToken | null;
  tokens: IToken[];
  isFetching: boolean;
  balance: IAccountBalanceResponse;
  isStationInstalled: boolean;

  setAccount: (account: IAccount | null) => void;
  setToken: (token: IToken | null) => void;

  setAvailableAccounts: (accounts: any) => void;
  setAvailableTokens: (tokens: any) => void;
  setStationInstalled: (isStationInstalled: boolean) => void;

  getAccounts: () => void;
  getTokens: () => void;
}

const accountStore = (set: any, get: any) => ({
  accounts: [],
  tokens: [],
  token: null,
  account: null,
  isFetching: false,
  balance: {
    finalBalance: '',
    candidateBalance: '',
  },
  isStationInstalled: false,

  clientFactory: ClientFactory.createDefaultClient(
    DefaultProviderUrls.BUILDNET,
    false,
  ),

  setAvailableAccounts: (accounts: IAccount) => {
    set({ accounts: accounts });
  },

  setAvailableTokens: (tokens: IToken) => {
    set({ tokens: tokens });
  },

  setStationInstalled: (isStationInstalled: boolean) =>
    set({ isStationInstalled: isStationInstalled }),

  getTokens: async () => {
    set({ isFetching: true });

    const clientFactory = await get().clientFactory;

    const firstAccount = get().accounts?.at(0);

    if (clientFactory && firstAccount) {
      const supportedTokens = await getSupportedTokensList(clientFactory);

      const tokens: IToken[] = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals, allowance, balance] =
            await Promise.all([
              getMassaTokenName(tokenPair.massaToken, clientFactory),
              getMassaTokenSymbol(tokenPair.massaToken, clientFactory),
              getDecimals(tokenPair.massaToken, clientFactory),
              getAllowance(tokenPair.massaToken, clientFactory, firstAccount),
              getBalance(tokenPair.massaToken, clientFactory, firstAccount),
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

      set({
        tokens: tokens,
        token: tokens.length ? tokens[0] : null,
        isFetching: false,
      });
    }
  },

  getAccounts: async () => {
    set({ isFetching: true });

    try {
      const providerList = await providers();

      if (providerList.length === 0) {
        set({ isFetching: false, isStationInstalled: false });
        return;
      }

      const massaStationWallet = providerList.find(
        (provider: IProvider) => provider.name() === MASSA_STATION,
      );

      if (massaStationWallet) set({ isStationInstalled: true });

      const fetchedAccounts = await massaStationWallet?.accounts();

      if (fetchedAccounts && fetchedAccounts.length > 0) {
        const firstAccount = fetchedAccounts.at(0);

        let firstAccountBalance = null;
        if (firstAccount) {
          firstAccountBalance = await firstAccount.balance();
        }
        set({
          accounts: fetchedAccounts,
          account: firstAccount,
          balance: firstAccountBalance,
        });
      }
    } catch (error) {
      console.error(error);

      set({ isFetching: false, isStationInstalled: false });
    }
    set({ isFetching: false });
  },

  setAccount: (account: IAccount | null) => set({ account }),
  setToken: (token: IToken | null) => set({ token }),
});

export default accountStore;
