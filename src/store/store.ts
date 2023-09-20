import { create } from 'zustand';

import accountStore, { AccountStoreState } from './accountStore';
import configStore, { ConfigStoreState } from './configStore';
import networkStore, { NetworktoreState } from './networkStore';
import { NETWORKS } from '@/const';
import { getCurrentStationNetwork } from '@/custom/provider/getNetwork';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  ...accountStore(set, get),
}));

export const useNetworkStore = create<NetworktoreState>((set, get) => ({
  ...networkStore(set, get),
}));

async function _fetchStationNetwork() {
  const currentNetwork = await getCurrentStationNetwork();

  useNetworkStore.getState().setCurrentNetwork(currentNetwork);
  useNetworkStore.getState().setAvailableNetworks(NETWORKS);
}

async function _initializeStores() {
  _fetchStationNetwork();
}

_initializeStores();
setInterval(() => {
  _fetchStationNetwork();
}, 5000);
