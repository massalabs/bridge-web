import {
  MAINNET as web3Mainnet,
  BUILDNET as web3Buildnet,
} from '@massalabs/massa-web3';
import { mainnet, sepolia, bsc, bscTestnet } from 'wagmi/chains';

export const MassaNetworks = {
  mainnet: web3Mainnet.toLowerCase(),
  buildnet: web3Buildnet.toLowerCase(),
};

// function that validate the connected network is the right one

export function validateEvmNetwork(
  isMainnet: boolean,
  chainId?: number,
): boolean {
  if (isMainnet) {
    return chainId === mainnet.id;
  } else {
    return chainId === sepolia.id;
  }
}

export function validateBscNetwork(
  isMainnet: boolean,
  chainId?: number,
): boolean {
  if (isMainnet) {
    return chainId === bsc.id;
  } else {
    return chainId === bscTestnet.id;
  }
}

export function validateMassaNetwork(
  isMainnet: boolean,
  massaNetwork?: string,
): boolean {
  if (isMainnet) {
    return massaNetwork === MassaNetworks.mainnet;
  } else {
    return massaNetwork === MassaNetworks.buildnet;
  }
}
