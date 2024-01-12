import { BridgeMode } from '../const';

export interface ModeStore {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet: boolean;

  setCurrentMode: (mode: BridgeMode) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modeStore = (
  set: (params: Partial<ModeStore>) => void,
  _get: () => ModeStore,
) => ({
  currentMode: BridgeMode.mainnet,
  availableModes: Object.values(BridgeMode),
  isMainnet: true,
  setCurrentMode: (mode: BridgeMode) => {
    set({ currentMode: mode });
    set({ isMainnet: mode === BridgeMode.mainnet });
  },
});

export default modeStore;
