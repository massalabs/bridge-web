import { persist } from 'zustand/middleware';
import { _setInStorage } from '@/utils/storage';

export const BRIDGE_THEME_STORAGE_KEY = 'bridge-theme';

export interface ConfigStoreState {
  lang: string;
  theme: string;

  setLang: (lang: string) => void;
  setTheme: (theme: string) => void;

  dropLang: () => void;
  dropTheme: () => void;
}

const configStore = persist<ConfigStoreState>(
  (set) => ({
    lang: 'en_US',
    theme: 'theme-dark',

    setLang: (lang: string) => set({ lang }),
    setTheme: (theme: string) => {
      set({ theme });
      _setInStorage(BRIDGE_THEME_STORAGE_KEY, theme);
    },

    dropLang: () => set({ lang: 'en_US' }),
    dropTheme: () => set({ theme: 'theme-dark' }),
  }),
  {
    name: 'config-store',
  },
);

export default configStore;
