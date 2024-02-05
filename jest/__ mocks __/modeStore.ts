import { BridgeMode } from '../../src/const';
import { ModeStoreState } from '../../src/store/modeStore';
import { useBridgeModeStore } from '../../src/store/store';

export let modeStoreMock: jest.SpyInstance<ModeStoreState>;

export const initModeStoreMock = () => {
  modeStoreMock = jest.spyOn(useBridgeModeStore, 'getState').mockImplementation(
    (): ModeStoreState =>
      ({
        currentMode: BridgeMode.testnet,
        isMainnet: false,
      } as any as ModeStoreState),
  );
};
