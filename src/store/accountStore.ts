/* eslint-disable @typescript-eslint/no-explicit-any */
import { providers, IAccount } from '@massalabs/wallet-provider';
import { MASSA_STATION } from '@/const';
import { getSupportedTokensList } from '@/custom/bridge/bridge';
import { getMassaTokenName } from '@/custom/token/token';

export interface IToken {
  name: string;
  massaToken: string;
  evmToken: string;
  chainId: number;
}

export interface AccountStoreState {
  account: IAccount | null;
  accounts: IAccount[];
  token: IToken | null;
  tokens: IToken[];

  setAccount: (account: IAccount | null) => void;
  setToken: (account: IAccount | null) => void;

  setAvailableAccounts: (accounts: any) => void;
  setAvailableTokens: (tokens: any) => void;

  getAccounts: () => void;
  getTokens: () => void;
}

const accountStore = (set: any, get: any) => ({
  selectedAccount: null,
  selectedToken: null,
  accounts: [],
  tokens: [],

  setAvailableAccounts: (accounts: IAccount) => {
    set({ accounts: accounts });
  },

  setAvailableTokens: (tokens: IToken) => {
    set({ tokens: tokens });
  },

  getTokens: async () => {
    let firstAccount = get().accounts.at(0);

    if (firstAccount) {
      let overriddenFetchAvailableTokens: IToken[] = [];
      let supportedTokens = await getSupportedTokensList(firstAccount);

      supportedTokens.forEach(async (at) => {
        if (firstAccount) {
          // we are overriding the tuple to include token name
          overriddenFetchAvailableTokens.push({
            ...at,
            name: await getMassaTokenName(at.massaToken, firstAccount),
          });
        }
      });
      set({ tokens: overriddenFetchAvailableTokens });
    }
  },

  getAccounts: async () => {
    const massaStationProvider = providers().find(
      (provider) => provider.name() === MASSA_STATION,
    );
    set({ accounts: await massaStationProvider?.accounts() });
  },

  setAccount: (selectedAccount: IAccount | null) => set({ selectedAccount }),
  setToken: (selectedToken: IToken | null) => set({ selectedToken }),
});

export default accountStore;
