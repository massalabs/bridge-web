import {
  MAINNET as web3Mainnet,
  BUILDNET as web3Buildnet,
} from '@massalabs/massa-web3';
import { mainnet, sepolia } from 'wagmi';

export const MassaNetworks = {
  mainnet: web3Mainnet.toLowerCase(),
  buildnet: web3Buildnet.toLowerCase(),
};

// function that validate the connected network is the right one
export function validateEvmNetwork(
  isMainnet: boolean,
  evmChainId?: number,
): boolean {
  if (isMainnet) {
    return evmChainId === mainnet.id;
  } else {
    return evmChainId === sepolia.id;
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
