import { ProvidersListener } from '@massalabs/wallet-provider';
import { create } from 'zustand';
import accountStore, { AccountStoreState } from './accountStore';
import configStore, {
  BRIDGE_THEME_STORAGE_KEY,
  ConfigStoreState,
} from './configStore';
import { SELECTED_EVM_STORAGE_KEY, useOperationStore } from './operationStore';
import { useTokenStore } from './tokenStore';
import { LAST_USED_ACCOUNT, _getFromStorage } from '../utils/storage';
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

export { useBridgeModeStore } from './modeStore';

function initConfigStore() {
  let theme = _getFromStorage(BRIDGE_THEME_STORAGE_KEY);
  if (theme) {
    theme = JSON.parse(theme);
    useConfigStore.getState().setTheme(theme);
  } else {
    useConfigStore.getState().setTheme('theme-dark');
  }
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

  new ProvidersListener(2000).subscribe((providers) => {
    useAccountStore.getState().setProviders(providers);
  });
}

function initOperationStore() {
  const storedEvm = _getFromStorage(SELECTED_EVM_STORAGE_KEY);
  if (storedEvm) {
    const evm = JSON.parse(storedEvm);
    useOperationStore.getState().setSelectedEvm(evm);
  }
}

async function initTokenStore() {
  useTokenStore.getState().refreshTokens();
}

async function initializeStores() {
  initConfigStore();
  initOperationStore();
  await initAccountStore();
  await initTokenStore();
}

initializeStores();
