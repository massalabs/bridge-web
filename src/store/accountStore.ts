/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  providers,
  IAccount,
  IAccountBalanceResponse,
  IProvider,
} from '@massalabs/wallet-provider';

import { MASSA_STATION } from '@/const';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import { getMassaTokenSymbol } from '@/custom/token/token';

export interface IToken {
  name: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
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

    let firstAccount = get().accounts?.at(0);

    if (firstAccount) {
      let overriddenFetchAvailableTokens: IToken[] = [];
      let supportedTokens = await getSupportedTokensList(firstAccount);

      const tokenNamePromises = supportedTokens.map(async (tokenPair) => {
        overriddenFetchAvailableTokens.push({
          ...tokenPair,
          name: await getMassaTokenSymbol(tokenPair.massaToken, firstAccount),
        });
      });
      await Promise.all(tokenNamePromises);

      const firstToken = overriddenFetchAvailableTokens?.at(0);

      set({
        tokens: overriddenFetchAvailableTokens,
        token: firstToken ?? null,
        isFetching: false,
      });
    }
  },

  getAccounts: async () => {
    console.log('getAccounts');
    set({ isFetching: true });

    try {
      console.log('Before providers');
      const providerList = await providers();
      console.log('After providers');
      console.log('providerList: ', providerList);

      const massaStationWallet = providerList.find(
        (provider: IProvider) => provider.name() === MASSA_STATION,
      );
      console.log('massaStationWallet: ', massaStationWallet);
      const fetchedAccounts = await massaStationWallet?.accounts();
      console.log('fetchedAccounts: ', fetchedAccounts);
      if (fetchedAccounts?.length === 0) {
        set({
          isFetching: false,
        });
      } else {
        const firstAccount = fetchedAccounts?.at(0);
        console.log('firstAccount: ', firstAccount);

        let firstAccountBalance = null;
        if (firstAccount) {
          firstAccountBalance = await firstAccount?.balance();
        }
        set({
          accounts: fetchedAccounts,
          account: firstAccount ?? null,
          isFetching: false,
          balance: firstAccountBalance,
        });
      }
    } catch (error) {
      console.log(error);
    }
    // finally {
    //   set({ isFetching: false });
    // }
  },

  setAccount: (account: IAccount | null) => set({ account }),
  setToken: (token: IToken | null) => set({ token }),
});

export default accountStore;
