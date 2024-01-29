import { useTokenStore } from './tokenStore';
import { BridgeMode } from '../const';
import { BRIDGE_MODE_STORAGE_KEY, _setInStorage } from '../utils/storage';
import { SIDE } from '@/utils/const';

export interface ModeStoreState {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet: boolean;
  side: SIDE;

  setCurrentMode: (mode: BridgeMode) => void;
  setSide(side: SIDE): void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modeStore = (
  set: (params: Partial<ModeStoreState>) => void,
  get: () => ModeStoreState,
) => ({
  currentMode: BridgeMode.mainnet,
  availableModes: Object.values(BridgeMode),
  isMainnet: true,
  side: SIDE.MASSA_TO_EVM,
  setCurrentMode: (mode: BridgeMode) => {
    const previousMode = get().currentMode;
    set({ currentMode: mode, isMainnet: mode === BridgeMode.mainnet });
    _setInStorage(BRIDGE_MODE_STORAGE_KEY, mode);

    // if the mode has changed, we need to refresh the tokens
    if (previousMode !== mode) {
      useTokenStore.getState().getTokens();
    }
  },
  setSide(side: SIDE) {
    set({ side });
  },
});

export default modeStore;
