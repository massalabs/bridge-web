/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, ClientFactory } from '@massalabs/massa-web3';
import {
  providers,
  IAccount,
  IAccountBalanceResponse,
  IProvider,
} from '@massalabs/wallet-provider';

import { MASSA_STATION } from '@/const';
import { BRIDGE_ACCOUNT_ADDRESS } from '@/utils/const';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

export interface AccountStoreState {
  connectedAccount: IAccount | null;
  massaClient: Client | null;
  accounts: IAccount[];
  isFetching: boolean;
  balance: IAccountBalanceResponse;
  isStationInstalled: boolean;
  providersFetched: IProvider[];

  setConnectedAccount: (account?: IAccount) => void;
  getConnectedAddress: () => string | undefined;

  setAvailableAccounts: (accounts: any) => void;
  setStationInstalled: (isStationInstalled: boolean) => void;
  startRefetch: () => void;

  loadAccounts: (providerList: IProvider[]) => void;
  getAccounts: () => void;
}

const accountStore = (
  set: (params: Partial<AccountStoreState>) => void,
  get: () => AccountStoreState,
) => ({
  accounts: [],
  massaClient: null,
  connectedAccount: null,
  isFetching: false,
  balance: {
    finalBalance: '',
    candidateBalance: '',
  },
  isStationInstalled: false,
  providersFetched: [],

  getConnectedAddress(): string | undefined {
    return get().connectedAccount?.address();
  },

  setAvailableAccounts: (accounts: IAccount[]) => {
    set({ accounts });
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
      const previousConnectedAccount = get().connectedAccount;

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
});

export default accountStore;
