import { ETH_MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID } from './const';

// function that validate the connected network is the right one
export function validateNetwork(
  isMainnet: boolean,
  evmChainId?: number,
): boolean {
  if (
    (isMainnet && evmChainId !== ETH_MAINNET_CHAIN_ID) ||
    (!isMainnet && evmChainId !== SEPOLIA_CHAIN_ID)
  ) {
    return false;
  }
  return true;
}
