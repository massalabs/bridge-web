import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import {
  isBnbNetworkValid,
  isEthNetworkValid,
  isMassaNetworkValid,
} from '@/utils/networkValidation';

// These hooks are used to check if the user is connected to the right network

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
