import { providers } from '@massalabs/wallet-provider';
import { create } from 'zustand';

import accountStore, { AccountStoreState } from './accountStore';
import configStore, { ConfigStoreState } from './configStore';
import modeStore, { ModeStoreState } from './modeStore';
import operationStore, { OperationStoreState } from './operationStore';
import { BRIDGE_MODE } from '../utils/const';
import { _getFromStorage } from '../utils/storage';
import { BridgeMode } from '@/const';
export { useTokenStore } from './tokenStore';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  ...accountStore(set, get),
}));

export const useBridgeModeStore = create<ModeStoreState>((set, get) => ({
  ...modeStore(set, get),
}));

export const useOperationStore = create<OperationStoreState>((set, get) => ({
  ...operationStore(set, get),
}));

async function initModeStore() {
  let mode = _getFromStorage(BRIDGE_MODE) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useBridgeModeStore.getState().setCurrentMode(mode);
}

async function initAccountStore() {
  setInterval(async () => {
    useAccountStore.setState({ providersFetched: await providers() });
  }, 1000);
}

async function initializeStores() {
  await initModeStore();
  await initAccountStore();
}

initializeStores();
