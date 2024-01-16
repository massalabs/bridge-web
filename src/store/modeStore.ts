import { BridgeMode } from '../const';
import { BRIDGE_MODE_STORAGE_KEY, _setInStorage } from '../utils/storage';

export interface ModeStoreState {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet: boolean;

  setCurrentMode: (mode: BridgeMode) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modeStore = (
  set: (params: Partial<ModeStoreState>) => void,
  _get: () => ModeStoreState,
) => ({
  currentMode: BridgeMode.mainnet,
  availableModes: Object.values(BridgeMode),
  isMainnet: true,
  setCurrentMode: (mode: BridgeMode) => {
    set({ currentMode: mode, isMainnet: mode === BridgeMode.mainnet });
    _setInStorage(BRIDGE_MODE_STORAGE_KEY, mode);
  },
});

export default modeStore;
