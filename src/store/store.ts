import { create } from 'zustand';

import accountStore, { AccountStoreState } from './accountStore';
import configStore, { ConfigStoreState } from './configStore';
import modeStore, { ModeStore } from './modeStore';
import { BRIDGE_MODE } from '../utils/const';
import { _getFromStorage } from '../utils/storage';
import { BridgeMode } from '@/const';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  ...accountStore(set, get),
}));

export const useBridgeModeStore = create<ModeStore>((set, get) => ({
  ...modeStore(set, get),
}));

async function initModeStore() {
  let mode = _getFromStorage(BRIDGE_MODE) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useBridgeModeStore.getState().setCurrentMode(mode);
}

async function initializeStores() {
  initModeStore();
}

initializeStores();
