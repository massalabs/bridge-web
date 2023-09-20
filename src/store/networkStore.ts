export interface NetworktoreState {
  currentNetwork: string | null;
  availableNetworks: string[];
  isMetamaskInstalled: boolean;

  setCurrentNetwork: (nickname: string | null) => void;
  setAvailableNetworks: (networks: string[]) => void;
  setIsMetamaskInstalled: (isInstalled: boolean) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const networkStore = (set: any, _get: any) => ({
  currentNetwork: null,
  availableNetworks: [],
  isMetamaskInstalled: false,

  setCurrentNetwork: (network: string | null) =>
    set({ currentNetwork: network }),

  setAvailableNetworks: (networks: string[]) =>
    set({ availableNetworks: networks }),

  setIsMetamaskInstalled: (isInstalled: boolean) =>
    set({ isMetamaskInstalled: isInstalled }),
});

export default networkStore;
