import { create } from 'zustand';
import accountStore, { AccountStoreState } from './accountStore';
import configStore, { ConfigStoreState } from './configStore';
import modeStore, { ModeStoreState } from './modeStore';
import operationStore, { OperationStoreState } from './operationStore';
import { useTokenStore } from './tokenStore';
import { BRIDGE_MODE_STORAGE_KEY, _getFromStorage } from '../utils/storage';
import { BridgeMode } from '@/const';
import { addOrRemoveProvider } from '@/utils/massaStation';
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
  let mode = _getFromStorage(BRIDGE_MODE_STORAGE_KEY) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useBridgeModeStore.getState().setCurrentMode(mode);
}

async function initAccountStore() {
  setInterval(async () => {
    addOrRemoveProvider();
  }, 1000);
}

async function initTokenStore() {
  let mode = _getFromStorage(BRIDGE_MODE_STORAGE_KEY) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useTokenStore.getState().getTokens();
}

async function initializeStores() {
  await initModeStore();
  await initAccountStore();
  await initTokenStore();
}

initializeStores();
