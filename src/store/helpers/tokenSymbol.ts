export function getMASSASymbol(symbol: string) {
  return symbol;
}
export function getEVMSymbol(symbol: string) {
  // removes any ". + alphanumeric " from string
  return symbol.replace(/\.[^.]+$/, '');
}
