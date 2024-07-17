export function getMASSASymbol(symbol: string) {
  return symbol;
}
export function getEVMSymbol(symbol: string) {
  // removes any ". + alphanumeric " from string
  if (symbol === 'WETH.b') return 'ETH';
  return symbol.replace(/\.[^.]+$/, '');
}
