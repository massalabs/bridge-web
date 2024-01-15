/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client, ClientFactory } from '@massalabs/massa-web3';
import { providers, IAccount, IProvider } from '@massalabs/wallet-provider';

import { MASSA_STATION } from '@/const';
import { BRIDGE_ACCOUNT_ADDRESS } from '@/utils/const';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

export interface AccountStoreState {
  connectedAccount: IAccount | null;
  massaClient: Client | undefined;
  accounts: IAccount[];
  isFetching: boolean;
  isStationInstalled: boolean;
  providersFetched: IProvider[];

  setConnectedAccount: (account?: IAccount) => void;
  getConnectedAddress: () => string | undefined;
  setMassaClient(massaClient?: Client): void;

  setAvailableAccounts: (accounts: any) => void;
  setStationInstalled: (isStationInstalled: boolean) => void;

  loadAccounts: (providerList: IProvider[]) => void;
  getAccounts: () => void;
}

const accountStore = (
  set: (params: Partial<AccountStoreState>) => void,
  get: () => AccountStoreState,
) => ({
  accounts: [],
  massaClient: undefined,
  connectedAccount: null,
  isFetching: false,
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
        });
      }
    } else {
      set({
        massaClient: undefined,
        accounts: [],
        connectedAccount: null,
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

  setMassaClient(massaClient?: Client) {
    set({ massaClient });
  },

  setConnectedAccount: async (connectedAccount?: IAccount) => {
    set({ connectedAccount });
    if (connectedAccount) {
      _setInStorage(BRIDGE_ACCOUNT_ADDRESS, connectedAccount.address());
    }
  },
});

export default accountStore;
