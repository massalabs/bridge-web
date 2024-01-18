import {
  MAINNET as web3Mainnet,
  BUILDNET as web3Buildnet,
} from '@massalabs/massa-web3';
import { ETH_MAINNET_CHAIN_ID, SEPOLIA_CHAIN_ID } from './const';

export const MassaNetworks = {
  mainnet: web3Mainnet.toLowerCase(),
  buildnet: web3Buildnet.toLowerCase(),
};

// function that validate the connected network is the right one
export function validateEvmNetwork(
  isMainnet: boolean,
  evmChainId: number,
): boolean {
  if (isMainnet) {
    return evmChainId === ETH_MAINNET_CHAIN_ID;
  } else {
    return evmChainId === SEPOLIA_CHAIN_ID;
  }
}

export function validateMassaNetwork(
  isMainnet: boolean,
  massaNetwork: string,
): boolean {
  if (isMainnet) {
    return massaNetwork === MassaNetworks.mainnet;
  } else {
    return massaNetwork === MassaNetworks.buildnet;
  }
}
