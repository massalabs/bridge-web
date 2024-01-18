import { Client, ClientFactory } from '@massalabs/massa-web3';
import { IAccount, IProvider } from '@massalabs/wallet-provider';
import { useTokenStore } from './tokenStore';
import { SUPPORTED_MASSA_WALLETS } from '@/const';
import { handleBearbyAccountChange } from '@/store/helpers/massaProviders';
import { BRIDGE_ACCOUNT_ADDRESS } from '@/utils/const';
import { _getFromStorage, _setInStorage } from '@/utils/storage';

export interface AccountStoreState {
  connectedAccount?: IAccount;
  massaClient?: Client;
  accounts: IAccount[];
  currentProvider?: IProvider;
  providers: IProvider[];
  isFetching: boolean;
  accountObserver: {
    unsubscribe: () => void;
  } | null;

  isBearbyConnected: boolean;

  setCurrentProvider: (provider?: IProvider) => void;
  setProviders: (providers: IProvider[]) => void;

  setConnectedAccount: (account?: IAccount) => void;
  setAvailableAccounts: (accounts: IAccount[]) => void;
}

const accountStore = (
  set: (params: Partial<AccountStoreState>) => void,
  get: () => AccountStoreState,
) => ({
  accounts: [],
  connectedAccount: undefined,
  accountObserver: null,
  massaClient: undefined,
  currentProvider: undefined,
  providers: [],
  isFetching: false,
  isBearbyConnected: false,

  setCurrentProvider: (currentProvider?: IProvider) => {
    try {
      set({ isFetching: true });

      if (!currentProvider) {
        set({ currentProvider, connectedAccount: undefined, accounts: [] });
        return;
      }

      if (currentProvider?.name() === SUPPORTED_MASSA_WALLETS.BEARBY) {
        if (!get().isBearbyConnected) {
          currentProvider
            .connect()
            .then(() => {
              set({ isBearbyConnected: true });
              const observer = currentProvider.listenAccountChanges(
                (newAddress: string) => {
                  handleBearbyAccountChange(newAddress);
                },
              );
              set({ currentProvider, accountObserver: observer });
              currentProvider
                .accounts()
                .then((accounts) => {
                  // bearby expose only 1 account
                  get().setConnectedAccount(accounts[0]);
                  get().setAvailableAccounts(accounts);
                })
                .catch((error) => {
                  console.warn('error getting accounts from bearby', error);
                });
            })
            .catch((error) => {
              console.warn('error connecting to bearby', error);
            });
          return;
        }
      } else {
        get().accountObserver?.unsubscribe();
        set({ accountObserver: null, isBearbyConnected: false }); // unset isBearbyConnected ??
      }

      set({ currentProvider });

      currentProvider
        .accounts()
        .then((accounts) => {
          get().setAvailableAccounts(accounts);
          const storedAccount = _getFromStorage(
            BRIDGE_ACCOUNT_ADDRESS + currentProvider?.name(),
          );
          const selectedAccount =
            accounts.find((account) => account.address() === storedAccount) ||
            accounts[0];
          get().setConnectedAccount(selectedAccount);
        })
        .catch((error) => {
          console.warn('error getting accounts from provider', error);
        });
    } finally {
      set({ isFetching: false });
    }
  },

  setProviders: (providers: IProvider[]) => {
    set({ providers });

    // if current provider is not in the new list of providers, unset it
    if (!providers.some((p) => p.name() === get().currentProvider?.name())) {
      set({
        massaClient: undefined,
        currentProvider: undefined,
        connectedAccount: undefined,
        accounts: [],
      });
    }
  },

  setAvailableAccounts: (accounts: IAccount[]) => {
    set({ accounts });
  },

  // set the connected account, and update the massa client
  setConnectedAccount: async (connectedAccount?: IAccount) => {
    set({ connectedAccount });
    if (connectedAccount) {
      const provider = get().currentProvider!;
      _setInStorage(
        BRIDGE_ACCOUNT_ADDRESS + provider?.name(),
        connectedAccount.address(),
      );
      useTokenStore.getState().refreshBalances();
      // update the massa client with the new account
      set({
        massaClient: await ClientFactory.fromWalletProvider(
          provider,
          connectedAccount,
        ),
      });
    }
  },
});

export default accountStore;
