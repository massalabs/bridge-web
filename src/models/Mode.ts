import { BridgeMode } from '../const';

export interface ModeModel {
  currentMode: BridgeMode;
  availableModes: BridgeMode[];
  isMainnet: boolean;
}
