import { BUILDNET_CHAIN_ID, MAINNET_CHAIN_ID } from '@massalabs/massa-web3';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useIsPageBridge, useIsPageDAOMaker } from './location';
import { SupportedEvmBlockchain } from '@/const';
import {
  useAccountStore,
  useBridgeModeStore,
  useOperationStore,
} from '@/store/store';

// These hooks are used to check if the user is connected to the right network

export enum ChainContext {
  DAO = 'DAO',
  BRIDGE = 'BRIDGE',
  CONNECT = 'CONNECT',
}

/**
 *
 * @returns target chain id for Binance Smart Chain
 */
export function useGetTargetBscChainId(): number {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  return isMainnet ? bsc.id : bscTestnet.id;
}

/**
 *
 * @returns target chain id for Ethereum
 */
export function useGetTargetEthChainId(): number {
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  return isMainnet ? mainnet.id : sepolia.id;
}

/**
 *
 * @returns target chain id for the selected EVM chain
 */
export function useGetTargetEvmChainId(): number {
  const { selectedEvm } = useOperationStore();
  const targetBscChainId = useGetTargetBscChainId();
  const targetEthChainId = useGetTargetEthChainId();
  return selectedEvm === SupportedEvmBlockchain.ETH
    ? targetEthChainId
    : targetBscChainId;
}

interface getChainValidationContext {
  targetChainId: number;
  context: ChainContext;
}

// Get context for chain validation depending on url
export function useGetChainValidationContext(): getChainValidationContext {
  const isPageDAOMaker = useIsPageDAOMaker();
  const isPageBridge = useIsPageBridge();
  const targetBscChainId = useGetTargetBscChainId();
  const targetEvmChainId = useGetTargetEvmChainId();

  if (isPageDAOMaker) {
    return {
      targetChainId: targetBscChainId,
      context: ChainContext.DAO,
    };
  }
  if (isPageBridge) {
    return {
      targetChainId: targetEvmChainId,
      context: ChainContext.BRIDGE,
    };
  } else {
    return {
      targetChainId: targetEvmChainId,
      context: ChainContext.CONNECT,
    };
  }
}

// Validates evm chain depending on supplied context (DAO, BRIDGE, CONNECT)
export function useEvmChainValidation(context: ChainContext): boolean {
  const { chain } = useAccount();
  const targetBscChainId = useGetTargetBscChainId();
  const targetEvmChainId = useGetTargetEvmChainId();

  if (!chain) return false;

  if (context === ChainContext.DAO) {
    return chain.id === targetBscChainId;
  } else if (context === ChainContext.BRIDGE) {
    return chain.id === targetEvmChainId;
  } else {
    return chain.id === targetBscChainId || chain.id === targetEvmChainId;
  }
}

export function useMassaNetworkValidation(): boolean {
  const { chainId } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const targetMassaChain = isMainnet ? MAINNET_CHAIN_ID : BUILDNET_CHAIN_ID;
  return chainId === targetMassaChain;
}
