import { create } from 'zustand';

import accountStore, { AccountStoreState } from './accountStore';
import configStore, { ConfigStoreState } from './configStore';
import networkStore, { NetworktoreState } from './networkStore';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  ...accountStore(set, get),
}));

export const useNetworkStore = create<NetworktoreState>((...obj) => ({
  ...networkStore(...obj),
}));
