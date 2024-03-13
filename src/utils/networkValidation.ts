import { BUILDNET_CHAIN_ID, MAINNET_CHAIN_ID } from '@massalabs/massa-web3';
import { mainnet, sepolia, bsc, bscTestnet } from 'wagmi/chains';

// Three functions that check if the  user's current chainID
// is the same as the expected chainID compared to the selected network mode

export function isEvmNetworkValid(
  isMainnet: boolean,
  chainId?: number,
): boolean {
  return (
    isEthNetworkValid(isMainnet, chainId) ||
    isBnbNetworkValid(isMainnet, chainId)
  );
}

export function isEthNetworkValid(
  isMainnet: boolean,
  chainId?: number,
): boolean {
  if (isMainnet) {
    return chainId === mainnet.id;
  } else {
    return chainId === sepolia.id;
  }
}

export function isBnbNetworkValid(
  isMainnet: boolean,
  chainId?: number,
): boolean {
  if (isMainnet) {
    return chainId == bsc.id;
  } else {
    return chainId == bscTestnet.id;
  }
}

export function isMassaNetworkValid(
  isMainnet: boolean,
  massaNetwork: bigint,
): boolean {
  if (isMainnet) {
    return massaNetwork === MAINNET_CHAIN_ID;
  } else {
    return massaNetwork === BUILDNET_CHAIN_ID;
  }
}
