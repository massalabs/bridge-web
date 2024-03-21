import { useEffect, useState } from 'react';
import { bsc, bscTestnet, mainnet, sepolia } from 'viem/chains';
import { useAccount } from 'wagmi';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import {
  isBnbNetworkValid,
  isEthNetworkValid,
  isMassaNetworkValid,
} from '@/utils/networkValidation';

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

export function useEthNetworkValidation() {
  // Used in the context of bridge/redeem
  const { chain } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidEthNetwork, setIsValidEthNetwork] = useState<boolean>(
    chain ? isEthNetworkValid(isMainnet, chain.id) : true,
  );

  useEffect(() => {
    if (chain) {
      setIsValidEthNetwork(isEthNetworkValid(isMainnet, chain.id));
    }
  }, [isMainnet, chain]);

  return {
    isValidEthNetwork,
  };
}

export function useMassaNetworkValidation() {
  // Used in the context of bridge/redeem
  const { chainId } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidMassaNetwork, setIsValidNetwork] = useState<boolean>(
    chainId ? isMassaNetworkValid(isMainnet, chainId) : true,
  );

  useEffect(() => {
    if (chainId) {
      setIsValidNetwork(isMassaNetworkValid(isMainnet, chainId));
    }
  }, [isMainnet, chainId]);

  return {
    isValidMassaNetwork,
  };
}

export function useBnbNetworkValidation() {
  // Use in context of dao maker
  const { chain } = useAccount();

  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidBnbNetwork, setIsValidBnbNetwork] = useState<boolean>(
    chain ? isBnbNetworkValid(isMainnet, chain.id) : true,
  );

  useEffect(() => {
    if (chain) {
      setIsValidBnbNetwork(isBnbNetworkValid(isMainnet, chain.id));
    }
  }, [isMainnet, chain]);

  return {
    isValidBnbNetwork,
  };
}
