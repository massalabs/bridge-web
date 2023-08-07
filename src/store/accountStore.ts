/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Client,
  ClientFactory,
  DefaultProviderUrls,
} from '@massalabs/massa-web3';
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
  connectedAccount: IAccount | null;
  massaClient: Client | null;
  accounts: IAccount[];
  token: IToken | null;
  tokens: IToken[];
  isFetching: boolean;
  balance: IAccountBalanceResponse;
  isStationInstalled: boolean;
  providersFetched: IProvider[];

  setConnectedAccount: (account?: IAccount) => void;
  setToken: (token: IToken | null) => void;

  setAvailableAccounts: (accounts: any) => void;
  setAvailableTokens: (tokens: any) => void;
  setStationInstalled: (isStationInstalled: boolean) => void;
  startRefetch: () => void;

  loadAccounts: (providerList: IProvider[]) => void;
  getAccounts: () => void;
  getTokens: () => void;
}

const accountStore = (set: any, get: any) => ({
  accounts: [],
  tokens: [],
  token: null,
  massaClient: null,
  connectedAccount: null,
  isFetching: false,
  balance: {
    finalBalance: '',
    candidateBalance: '',
  },
  isStationInstalled: false,
  providersFetched: [],

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

  setStationInstalled: (isStationInstalled: boolean) => {
    set({ isStationInstalled: isStationInstalled });
  },

  startRefetch: async () => {
    set({ providersFetched: await providers() });

    setInterval(async () => {
      set({ providersFetched: await providers() });
    }, 5000);
  },

  getTokens: async () => {
    set({ isFetching: true });

    const clientFactory = await get().clientFactory;

    const connectedAccount = get().connectedAccount;

    if (clientFactory && connectedAccount) {
      const supportedTokens = await getSupportedTokensList(clientFactory);

      const tokens: IToken[] = await Promise.all(
        supportedTokens.map(async (tokenPair) => {
          const [name, symbol, decimals, allowance, balance] =
            await Promise.all([
              getMassaTokenName(tokenPair.massaToken, clientFactory),
              getMassaTokenSymbol(tokenPair.massaToken, clientFactory),
              getDecimals(tokenPair.massaToken, clientFactory),
              getAllowance(
                tokenPair.massaToken,
                clientFactory,
                connectedAccount,
              ),
              getBalance(tokenPair.massaToken, clientFactory, connectedAccount),
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

  loadAccounts: async (providerList: IProvider[]) => {
    const massaStationWallet = providerList.find(
      (provider: IProvider) => provider.name() === MASSA_STATION,
    );

    if (massaStationWallet) set({ isStationInstalled: true });

    const fetchedAccounts = await massaStationWallet?.accounts();

    if (fetchedAccounts && fetchedAccounts.length > 0) {
      const firstAccountBalance = await fetchedAccounts[0].balance();

      const client = await ClientFactory.fromWalletProvider(
        providerList[0],
        fetchedAccounts[0],
      );

      const previousConnectedAccount: IAccount = get().connectedAccount;

      if (
        !previousConnectedAccount ||
        previousConnectedAccount?.name !== fetchedAccounts[0]?.name
      ) {
        set({
          massaClient: client,
          accounts: fetchedAccounts,
          connectedAccount: fetchedAccounts[0],
          balance: firstAccountBalance,
        });
      }
    } else {
      set({
        massaClient: null,
        accounts: [],
        connectedAccount: null,
        balance: {
          finalBalance: '',
          candidateBalance: '',
        },
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
      await get().loadAccounts(providerList);
    } catch (error) {
      console.error(error);

      set({ isFetching: false, isStationInstalled: false });
    }
    set({ isFetching: false });
  },

  setConnectedAccount: async (connectedAccount?: IAccount) => {
    if (!connectedAccount) {
      const defaultBalance = { finalBalance: '0', candidateBalance: '0' };
      set({
        connectedAccount,
        massaClient: undefined,
        balance: defaultBalance,
      });
      return;
    }

    const providerList = await providers();

    if (!providerList.length) {
      set({ connectedAccount: undefined, massaClient: undefined });
      return;
    }
    const balance = await connectedAccount.balance();
    const massaClient = await ClientFactory.fromWalletProvider(
      // if we want to support multiple providers like bearby, we need to pass the selected one here
      providerList[0],
      connectedAccount,
    );
    set({ connectedAccount, massaClient, balance });
  },

  setToken: (token: IToken | null) => set({ token }),
});

export default accountStore;
