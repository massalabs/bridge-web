import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface NetworktoreState {
  currentNetwork: string | null;
  availableNetworks: string[];
  isMetamaskInstalled: boolean;
  burnedOpList: RedeemOperationToClaim[];

  setCurrentNetwork: (nickname: string | null) => void;
  setAvailableNetworks: (networks: string[]) => void;
  setIsMetamaskInstalled: (isInstalled: boolean) => void;
  setBurnedOpList: (operationsToRedeem: RedeemOperationToClaim[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const networkStore = (set: any, _get: any) => ({
  currentNetwork: null,
  availableNetworks: [],
  isMetamaskInstalled: false,
  burnedOplist: [],

  setCurrentNetwork: (network: string | null) =>
    set({ currentNetwork: network }),

  setAvailableNetworks: (networks: string[]) =>
    set({ availableNetworks: networks }),

  setIsMetamaskInstalled: (isInstalled: boolean) =>
    set({ isMetamaskInstalled: isInstalled }),

  setBurnedOpList: (operationsToRedeem: RedeemOperationToClaim[]) =>
    set({ burnedOpList: operationsToRedeem }),
});

export default networkStore;
