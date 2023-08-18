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
import { BRIDGE_ACCOUNT_ADDRESS, BRIDGE_TOKEN } from '@/utils/const';

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

    const storedToken = _getFromStorage(BRIDGE_TOKEN)
      ? JSON.parse(_getFromStorage(BRIDGE_TOKEN))
      : undefined;

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

      const selectedToken = tokens.find(
        (token: IToken) => token.name === storedToken?.name,
      );
      const token = tokens.length ? selectedToken || tokens[0] : null;

      set({ tokens, token, isFetching: false });
      _setInStorage(BRIDGE_TOKEN, JSON.stringify(token));
    }
  },

  loadAccounts: async (providerList: IProvider[]) => {
    const massaStationWallet = providerList.find(
      (provider: IProvider) => provider.name() === MASSA_STATION,
    );

    if (massaStationWallet) {
      set({ isStationInstalled: true });
    } else {
      set({ isStationInstalled: false });
      return;
    }

    const fetchedAccounts = await massaStationWallet?.accounts();
    const storedAccount = _getFromStorage(BRIDGE_ACCOUNT_ADDRESS);

    if (fetchedAccounts && fetchedAccounts.length > 0) {
      const selectedAccount =
        fetchedAccounts.find((fa) => fa.address() === storedAccount) ||
        fetchedAccounts[0];
      const firstAccountBalance = await selectedAccount.balance();
      const client = await ClientFactory.fromWalletProvider(
        providerList[0],
        selectedAccount,
      );
      const previousConnectedAccount: IAccount = get().connectedAccount;

      if (
        !previousConnectedAccount ||
        previousConnectedAccount?.name !== selectedAccount?.name
      ) {
        set({
          massaClient: client,
          accounts: fetchedAccounts,
          connectedAccount: selectedAccount,
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

    _setInStorage(BRIDGE_ACCOUNT_ADDRESS, connectedAccount.address());
    set({ connectedAccount, massaClient, balance });
  },

  setToken: (token: IToken | null) => {
    set({ token });
    _setInStorage(BRIDGE_TOKEN, JSON.stringify(token));
  },
});

function _setInStorage(key: string, value: string): void {
  if (typeof Storage !== 'undefined') {
    localStorage.setItem(key, value);
  }
}

function _getFromStorage(key: string): string {
  return localStorage.getItem(key) || '';
}

export default accountStore;
