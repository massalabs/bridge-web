import { useTokenStore } from './tokenStore';
import { Blockchain, BridgeMode } from '../const';
import { BRIDGE_MODE_STORAGE_KEY, _setInStorage } from '../utils/storage';

export interface ModeStoreState {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet(): boolean;
  massaNetwork: string;
  evmNetwork: string;

  setCurrentMode: (mode: BridgeMode) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const modeStore = (
  set: (params: Partial<ModeStoreState>) => void,
  get: () => ModeStoreState,
) => ({
  currentMode: BridgeMode.mainnet,
  availableModes: Object.values(BridgeMode),

  isMainnet: () => get().currentMode === BridgeMode.mainnet,

  massaNetwork: '',
  evmNetwork: '',

  setCurrentMode: (mode: BridgeMode) => {
    const previousMode = get().currentMode;

    get().isMainnet();
    const isMainnetMode = get().isMainnet();
    set({
      currentMode: mode,
      massaNetwork: isMainnetMode
        ? Blockchain.MASSA_MAINNET
        : Blockchain.MASSA_BUILDNET,
      evmNetwork: isMainnetMode
        ? Blockchain.EVM_MAINNET
        : Blockchain.EVM_TESTNET,
    });

    _setInStorage(BRIDGE_MODE_STORAGE_KEY, mode);

    // if the mode has changed, we need to refresh the tokens
    if (previousMode !== mode) {
      useTokenStore.getState().getTokens();
    }
  },
});

export default modeStore;
