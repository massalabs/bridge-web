/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAccount } from '@massalabs/wallet-provider';

export interface IToken {
  name: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
}

export interface AccountStoreState {
  selectedAccount: IAccount | null;
  availableAccounts: IAccount[];
  selectedToken: IToken | null;
  availableTokens: IToken[];

  setAccount: (account: IAccount | null) => void;
  setToken: (account: IAccount | null) => void;

  setAvailableAccounts: (accounts: any) => void;
  setAvailableTokens: (tokens: any) => void;
}

const accountStore = (set: any) => ({
  selectedAccount: null,
  selectedToken: null,
  availableAccounts: [],
  availableTokens: [],

  setAvailableAccounts: (accounts: IAccount) => {
    set({ availableAccounts: accounts });
  },

  setAvailableTokens: (tokens: IToken) => {
    set({ availableTokens: tokens });
  },

  setAccount: (selectedAccount: IAccount | null) => set({ selectedAccount }),
  setToken: (selectedToken: IToken | null) => set({ selectedToken }),
});

export default accountStore;
