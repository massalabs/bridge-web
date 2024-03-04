import { useTokenStore } from './tokenStore';
import { Blockchain, BridgeMode } from '../const';
import { BRIDGE_MODE_STORAGE_KEY, _setInStorage } from '../utils/storage';

export interface ModeStoreState {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet(): boolean;
  massaNetwork(): string;
  evmNetwork(): string;

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

  massaNetwork: () =>
    get().isMainnet() ? Blockchain.MASSA_MAINNET : Blockchain.MASSA_BUILDNET,
  evmNetwork: () =>
    get().isMainnet() ? Blockchain.EVM_MAINNET : Blockchain.EVM_TESTNET,

  setCurrentMode: (mode: BridgeMode) => {
    const previousMode = get().currentMode;
    set({ currentMode: mode });

    _setInStorage(BRIDGE_MODE_STORAGE_KEY, mode);

    // if the mode has changed, we need to refresh the tokens

    // Found a bug here: if user swiches from testnet to mainnet and back to testnet quickly =>
    // the first switch call is made, but when the response arrives and user is back on testnet that see no tokens
    // and the second call is not made
    if (previousMode !== mode) {
      useTokenStore.getState().getTokens();
    }
  },
});

export default modeStore;
