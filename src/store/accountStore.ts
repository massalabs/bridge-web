import { Client, ClientFactory } from '@massalabs/massa-web3';
import { providers, IAccount, IProvider } from '@massalabs/wallet-provider';
import { MASSA_STATION, SUPPORTED_MASSA_WALLETS } from '@/const';
import { BRIDGE_ACCOUNT_ADDRESS } from '@/utils/const';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

export interface AccountStoreState {
  connectedAccount?: IAccount;
  massaClient?: Client;
  accounts: IAccount[];
  currentProvider?: IProvider;
  providers: IProvider[];
  isFetching: boolean;
  isStationInstalled: boolean;

  setConnectedAccount: (account?: IAccount) => void;

  setCurrentProvider: (provider?: IProvider) => void;
  setProviders: (providers: IProvider[]) => void;
  addProvider: (provider: IProvider) => void;
  removeProvider: (providerName: SUPPORTED_MASSA_WALLETS) => void;

  setAvailableAccounts: (accounts: any) => void;
  setStationInstalled: (isStationInstalled: boolean) => void;

  loadAccounts: (providerList: IProvider[]) => Promise<void>;
  getAccounts: () => void;
}

const accountStore = (
  set: (params: Partial<AccountStoreState>) => void,
  get: () => AccountStoreState,
) => ({
  accounts: [],
  massaClient: undefined,
  connectedAccount: undefined,
  currentProvider: undefined,
  providers: [],
  isFetching: false,
  isStationInstalled: false,

  setCurrentProvider: (currentProvider?: IProvider) => {
    set({ currentProvider });
  },

  setProviders: (providers: IProvider[]) => {
    set({ providers });
    set({ massaClient: undefined }); // reset the client
  },

  addProvider: (provider: IProvider) => {
    const providerList = get().providers;
    const existingProvider = providerList.find(
      (p) => p.name() === provider.name(),
    );
    if (!existingProvider) {
      set({ providers: [...providerList, provider] });
    }
  },

  removeProvider: (providerName: SUPPORTED_MASSA_WALLETS) => {
    const providerList = get().providers;
    const filteredProviders = providerList.filter(
      (p) => p.name() !== providerName,
    );
    set({ providers: filteredProviders });
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
      const massaClient = await ClientFactory.fromWalletProvider(
        providerList[0],
        selectedAccount,
      );
      const previousConnectedAccount = get().connectedAccount;

      if (
        !previousConnectedAccount ||
        previousConnectedAccount?.name !== selectedAccount?.name
      ) {
        set({
          massaClient,
          accounts: fetchedAccounts,
          connectedAccount: selectedAccount,
        });
      }
    } else {
      set({
        massaClient: undefined,
        accounts: [],
        connectedAccount: undefined,
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

  // set the connected account, and update the massa client
  setConnectedAccount: async (connectedAccount?: IAccount) => {
    set({ connectedAccount });
    if (connectedAccount) {
      _setInStorage(BRIDGE_ACCOUNT_ADDRESS, connectedAccount.address());

      // update the massa client with the new account
      const provider = get().currentProvider;
      if (provider) {
        set({
          massaClient: await ClientFactory.fromWalletProvider(
            // if we want to support multiple providers like bearby, we need to pass the selected one here
            provider,
            connectedAccount,
          ),
        });
      }
    }
  },
});

export default accountStore;
