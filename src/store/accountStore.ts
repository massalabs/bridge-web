// EXTERNALS
import { persist } from 'zustand/middleware';
import {
  IAccount,
  IAccountBalanceResponse,
  IProvider,
  providers,
} from '@massalabs/wallet-provider';

const MASSA_STATION = 'MASSASTATION';

export interface AccountStoreState {
  account: IAccount | null;
  availableAccounts: [] | undefined;

  setAccount: (account: IAccount | null) => void;
  getAvailableAccounts: () => void;

  // setAccounts: () => void;
}

const accountStore = 
  (set: any) => ({
    account: null,
    availableAccounts: undefined,

    getAvailableAccounts: async () => {

      const massaStationProvider = providers().find(
        (provider) => provider.name() === MASSA_STATION
      );
      debugger;
      console.log('providers', providers());
      
      set({ availableAccounts: await massaStationProvider?.accounts()});
    },
    
    setAccount: (account: IAccount | null) => set({ account }),
    
  });

export default accountStore;