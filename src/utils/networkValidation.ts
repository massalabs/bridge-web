import { mainnet, sepolia, bsc, bscTestnet } from 'wagmi/chains';
import { Blockchain } from '@/const';

// Three functions that check if the  user's current chainID
// is the same as the expected chainID compared to the selected network mode

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
  massaNetwork?: string,
): boolean {
  if (isMainnet) {
    return massaNetwork === Blockchain.MASSA_MAINNET;
  } else {
    return massaNetwork === Blockchain.MASSA_BUILDNET.toLowerCase();
  }
}
