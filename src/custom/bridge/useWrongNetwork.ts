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

  const [isValidEthNetwork, setIsValidEthNetwork] = useState<boolean>(false);

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
  const { connectedNetwork } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidMassaNetwork, setIsValidNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!connectedNetwork) return;
    setIsValidNetwork(isMassaNetworkValid(isMainnet, connectedNetwork));
  }, [isMainnet, connectedNetwork]);

  return {
    isValidMassaNetwork,
  };
}

export function useBnbNetworkValidation() {
  // Use in context of dao maker
  const { chain } = useAccount();

  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidBnbNetwork, setIsValidBnbNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (chain) setIsValidBnbNetwork(isBnbNetworkValid(isMainnet, chain.id));
  }, [isMainnet, chain]);

  return {
    isValidBnbNetwork,
  };
}
