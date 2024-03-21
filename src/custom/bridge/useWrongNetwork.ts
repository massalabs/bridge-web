import { BUILDNET_CHAIN_ID, MAINNET_CHAIN_ID } from '@massalabs/massa-web3';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

// These hooks are used to check if the user is connected to the right network

export enum ChainContext {
  DAO = 'DAO',
  BRIDGE = 'BRIDGE',
  CONNECT = 'CONNECT',
}

// Evm chain validation
export function useEvmChainValidation(context: ChainContext): boolean {
  const { chain } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  if (!chain) return false;
  const targetBnbChainId = isMainnet ? bsc.id : bscTestnet.id;
  const targetEthChainId = isMainnet ? mainnet.id : sepolia.id;

  if (context === ChainContext.DAO) {
    return chain.id === targetBnbChainId;
  } else if (context === ChainContext.BRIDGE) {
    return chain.id === targetEthChainId;
  } else {
    return chain.id === targetBnbChainId || chain.id === targetEthChainId;
  }
}

export function useMassaNetworkValidation(): boolean {
  const { chainId } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const targetMassaChain = isMainnet ? MAINNET_CHAIN_ID : BUILDNET_CHAIN_ID;
  return chainId === targetMassaChain;
}
