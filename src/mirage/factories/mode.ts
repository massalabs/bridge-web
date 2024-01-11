import { Factory } from 'miragejs';

import { BridgeMode } from '../../const';
import { ModeModel } from '../../models/Mode';

export const networkFactory = Factory.extend<ModeModel>({
  availableModes() {
    return Object.values(BridgeMode);
  },
  currentMode() {
    return BridgeMode.testnet;
  },
  isMainnet() {
    return false;
  },
});
