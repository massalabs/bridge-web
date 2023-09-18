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

import { useWalletStore } from './store';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import {
  getAllowance,
  getMassaTokenSymbol,
  getDecimals,
  getMassaTokenName,
  getBalance,
} from '@/custom/token/token';
import { BRIDGE_ACCOUNT_ADDRESS, BRIDGE_TOKEN } from '@/utils/const';
import {
  _dropFromStorage,
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
      const token = tokens.length ? selectedToken || tokens.at(0) : null;

      set({ tokens });
      get().setToken(token);
    }

    set({ isFetching: false });
  },

  loadAccounts: async (providerList: IProvider[]) => {
    const selectedWallet = useWalletStore.getState().currentWallet;
    const loadedProvider = providerList.find(
      (provider: IProvider) => provider.name() === selectedWallet,
    );

    set({
      isStationInstalled: Boolean(loadedProvider) && Boolean(selectedWallet),
    });

    const fetchedAccounts = await loadedProvider?.accounts();
    const storedAccount = _getFromStorage(BRIDGE_ACCOUNT_ADDRESS);

    if (fetchedAccounts && fetchedAccounts.length > 0) {
      const selectedAccount =
        fetchedAccounts.find((fa) => fa.address() === storedAccount) ||
        fetchedAccounts.at(0);

      get().setConnectedAccount(selectedAccount);
      get().setAvailableAccounts(fetchedAccounts);
    }
  },

  getAccounts: async () => {
    try {
      set({ isFetching: true });
      const providerList = await providers();

      set({ providersFetched: providerList });
      useWalletStore.getState().setWallets(providerList.map((p) => p.name()));

      await get().loadAccounts(providerList);
      set({ isFetching: false });
    } catch (error) {
      console.error(error);

      set({ isStationInstalled: false, isFetching: false });
    }
  },

  setConnectedAccount: async (connectedAccount?: IAccount) => {
    if (!connectedAccount) {
      const defaultBalance = { finalBalance: '0', candidateBalance: '0' };
      set({
        connectedAccount,
        massaClient: undefined,
        balance: defaultBalance,
      });
      _dropFromStorage(BRIDGE_ACCOUNT_ADDRESS);
      _dropFromStorage(BRIDGE_TOKEN);

      return;
    }

    const providerList = await providers();

    if (!providerList.length) {
      set({ connectedAccount: undefined, massaClient: undefined });
      return;
    }

    const selectedWallet = useWalletStore.getState().currentWallet;
    const loadedProvider = providerList.find(
      (provider: IProvider) => provider.name() === selectedWallet,
    );
    const balance = await connectedAccount.balance();

    if (loadedProvider) {
      const massaClient = await ClientFactory.fromWalletProvider(
        loadedProvider,
        connectedAccount,
      );

      _setInStorage(BRIDGE_ACCOUNT_ADDRESS, connectedAccount.address());
      set({ connectedAccount, massaClient, balance });
    }
  },

  setToken: (token: IToken | null) => {
    set({ token });
    _setInStorage(BRIDGE_TOKEN, JSON.stringify(token));
  },
});

export default accountStore;
