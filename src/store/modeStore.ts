import { create } from 'zustand';
import { useTokenStore } from './tokenStore';
import { Blockchain, BridgeMode } from '../const';

export interface ModeStoreState {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet(): boolean;
  massaNetwork(): string;
  setCurrentMode: (mode: BridgeMode) => void;
}

export const useBridgeModeStore = create<ModeStoreState>(
  (
    set: (params: Partial<ModeStoreState>) => void,
    get: () => ModeStoreState,
  ) => ({
    currentMode: BridgeMode.mainnet,
    availableModes: Object.values(BridgeMode),
    isMainnet: () => get().currentMode === BridgeMode.mainnet,

    massaNetwork: () =>
      get().isMainnet() ? Blockchain.MASSA_MAINNET : Blockchain.MASSA_BUILDNET,

    setCurrentMode: (mode: BridgeMode) => {
      const previousMode = get().currentMode;
      set({ currentMode: mode });

      // if the mode has changed, we need to refresh the tokens

      if (previousMode !== mode) {
        useTokenStore.getState().getTokens();
      }
    },
  }),
);
