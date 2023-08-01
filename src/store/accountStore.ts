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
  allowance: string;
  decimals: number;
  symbol: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
  balance: string;
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

    let clientFactory = await get().clientFactory;

    let firstAccount = get().accounts?.at(0);

    if (clientFactory && firstAccount) {
      let overriddenFetchAvailableTokens: IToken[] = [];
      let supportedTokens = await getSupportedTokensList(clientFactory);

      const tokenNamePromises = supportedTokens.map(async (tokenPair) => {
        overriddenFetchAvailableTokens.push({
          ...tokenPair,
          name: await getMassaTokenName(tokenPair.massaToken, clientFactory),
          symbol: await getMassaTokenSymbol(
            tokenPair.massaToken,
            clientFactory,
          ),
          decimals: await getDecimals(tokenPair.massaToken, clientFactory),
          allowance: (
            await getAllowance(
              tokenPair.massaToken,
              clientFactory,
              firstAccount,
            )
          ).toString(),
          balance: (
            await getBalance(tokenPair.massaToken, clientFactory, firstAccount)
          ).toString(),
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
