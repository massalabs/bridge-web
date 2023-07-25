// EXTERNALS
import { persist } from 'zustand/middleware';

export interface NetworktoreState {
  currentNetwork: string | null;
  availableNetworks: string[];
  isMetamaskInstalled: boolean;
  setCurrentNetwork: (nickname: string | null) => void;
  setAvailableNetworks: (networks: string[]) => void;
  setIsMetamaskInstalled: (isInstalled: boolean) => void;
}

const networkStore = persist<NetworktoreState>(
  (set) => ({
    currentNetwork: null,
    availableNetworks: [],
    isMetamaskInstalled: false,
    setCurrentNetwork: (nickname: string | null) =>
      set({ currentNetwork: nickname }),
    setAvailableNetworks: (networks: string[]) =>
      set({ availableNetworks: networks }),
    setIsMetamaskInstalled: (isInstalled: boolean) =>
      set({ isMetamaskInstalled: isInstalled }),
  }),
  {
    name: 'network-store',
  },
);

export default networkStore;
