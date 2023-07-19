/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount } from '@massalabs/wallet-provider';

export interface AccountStoreState {
  selectedAccount: IAccount | null;
  availableAccounts: [] | undefined;
  selectedToken: string | undefined;
  availableTokens: [] | undefined;

  setAccount: (account: IAccount | null) => void;
  setToken: (account: IAccount | null) => void;

  setAvailableAccounts: (accounts: any) => void;
  setAvailableTokens: (tokens: any) => void;
}

const accountStore = (set: any) => ({
  selectedAccount: null,
  selectedToken: null,
  availableAccounts: undefined,
  availableTokens: undefined,

  setAvailableAccounts: (accounts: any) => {
    set({ availableAccounts: accounts });
  },

  setAvailableTokens: (tokens: any) => {
    set({ availableTokens: tokens });
  },

  setAccount: (selectedAccount: IAccount | null) => set({ selectedAccount }),
  setToken: (selectedToken: string | null) => set({ selectedToken }),
});

export default accountStore;
