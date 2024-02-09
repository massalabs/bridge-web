// TODO: when the symbol in the MASSA blockchain will be suffixed with '.e'
// we will remove the suffix for the EVM symbol
// and keep the symbol as is for the MASSA blockchain

export function getMASSASymbol(symbol: string) {
  return symbol;
}

export function getEVMSymbol(symbol: string) {
  // remove the suffix '.e' from the symbol
  return symbol.replace('.e', '');
}