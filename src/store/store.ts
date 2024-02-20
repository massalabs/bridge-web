import { ProvidersListener } from '@massalabs/wallet-provider';
import { create } from 'zustand';
import accountStore, { AccountStoreState } from './accountStore';
import configStore, {
  BRIDGE_THEME_STORAGE_KEY,
  ConfigStoreState,
} from './configStore';
import modeStore, { ModeStoreState } from './modeStore';
import { useTokenStore } from './tokenStore';
import {
  BRIDGE_MODE_STORAGE_KEY,
  LAST_USED_ACCOUNT,
  _getFromStorage,
} from '../utils/storage';
import { BridgeMode } from '@/const';
import { areTosValid } from '@/custom/bridge/tos';
import { updateProviders } from '@/store/helpers/massaProviders';

export { useTokenStore } from './tokenStore';
export { useGlobalStatusesStore } from './globalStatusesStore';
export { useOperationStore } from './operationStore';

export const useConfigStore = create<ConfigStoreState>((...obj) => ({
  ...configStore(...obj),
}));

export const useAccountStore = create<AccountStoreState>((set, get) => ({
  ...accountStore(set, get),
}));

export const useBridgeModeStore = create<ModeStoreState>((set, get) => ({
  ...modeStore(set, get),
}));

function initConfigStore() {
  let theme = _getFromStorage(BRIDGE_THEME_STORAGE_KEY);
  if (theme) {
    theme = JSON.parse(theme);
    useConfigStore.getState().setTheme(theme);
  } else {
    useConfigStore.getState().setTheme('theme-dark');
  }
}

async function initModeStore() {
  let mode = _getFromStorage(BRIDGE_MODE_STORAGE_KEY) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useBridgeModeStore.getState().setCurrentMode(mode);
}

async function initAccountStore() {
  const providers = await updateProviders();

  const storedAccount = _getFromStorage(LAST_USED_ACCOUNT);
  if (storedAccount) {
    const { provider: lastUsedProvider } = JSON.parse(storedAccount);
    const provider = providers.find((p) => p.name() === lastUsedProvider);
    if (provider) {
      useAccountStore.getState().setCurrentProvider(provider);
    }
  }

  new ProvidersListener().subscribe((providers) => {
    useAccountStore.getState().setProviders(providers);
  });

  useAccountStore.getState().setTosAcceptance(areTosValid());
}

async function initTokenStore() {
  let mode = _getFromStorage(BRIDGE_MODE_STORAGE_KEY) as BridgeMode;

  if (!mode) {
    mode = BridgeMode.mainnet;
  }

  useTokenStore.getState().getTokens();
}

async function initializeStores() {
  initConfigStore();
  await initModeStore();
  await initAccountStore();
  await initTokenStore();
}

initializeStores();
