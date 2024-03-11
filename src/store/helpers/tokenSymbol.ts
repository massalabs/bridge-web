// TODO: when the symbol in the MASSA blockchain will be suffixed with '.e'
// we will remove the suffix for the EVM symbol
// and keep the symbol as is for the MASSA blockchain

import { useBridgeModeStore } from '../store';

export function getMASSASymbol(symbol: string) {
  return symbol;
}

export const mainnetExtension = '.e';
export const testnetExtension = '.s';

export function getEVMSymbol(symbol: string) {
  // remove the suffix '.e' from the symbol
  const { isMainnet: getIsMainnet } = useBridgeModeStore.getState();
  const isMainnet = getIsMainnet();
  const suffix = isMainnet ? mainnetExtension : testnetExtension;
  return symbol.replace(suffix, '');
}
