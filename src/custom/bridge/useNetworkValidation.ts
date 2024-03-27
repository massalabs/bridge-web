import { BUILDNET_CHAIN_ID, MAINNET_CHAIN_ID } from '@massalabs/massa-web3';
import { useLocation } from 'react-router-dom';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { PAGES } from '@/const';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

// These hooks are used to check if the user is connected to the right network

export enum ChainContext {
  DAO = 'DAO',
  BRIDGE = 'BRIDGE',
  CONNECT = 'CONNECT',
}

export function useGetTargetBnbChainId(): number {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  return isMainnet ? bsc.id : bscTestnet.id;
}
export function useGetTargetEthChainId(): number {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  return isMainnet ? mainnet.id : sepolia.id;
}

interface getChainValidationContext {
  targetChainId: number;
  context: ChainContext;
}

// Get context for chain validation depending on url
export function useGetChainValidationContext(): getChainValidationContext {
  const { pathname } = useLocation();
  const targetBnbChainId = useGetTargetBnbChainId();
  const targetEthChainId = useGetTargetEthChainId();
  if (pathname.includes(PAGES.DAO)) {
    return {
      targetChainId: targetBnbChainId,
      context: ChainContext.DAO,
    };
  } else if (pathname.includes(PAGES.INDEX)) {
    return {
      targetChainId: targetEthChainId,
      context: ChainContext.BRIDGE,
    };
  } else {
    return {
      targetChainId: targetEthChainId,
      context: ChainContext.CONNECT,
    };
  }
}

// Validates evm chain depending on supplied context (DAO, BRIDGE, CONNECT)
export function useEvmChainValidation(context: ChainContext): boolean {
  const { chain } = useAccount();
  const targetBnbChainId = useGetTargetBnbChainId();
  const targetEthChainId = useGetTargetEthChainId();
  if (!chain) return false;

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
