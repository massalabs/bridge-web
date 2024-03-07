import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsBnbConnected } from './useIsBnbConnected';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import {
  isBnbNetworkValid,
  isEthNetworkValid,
  isMassaNetworkValid,
} from '@/utils/networkValidation';

// TBD: this might be refactored into three seperate fns depending on the network check context: bridge, connect, DAO

// These hooks are used to check if the user is connected to the right network

export function useEthNetworkValidation() {
  // Used in the context of bridge/redeem
  const { chain } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const isBscConnected = useIsBnbConnected();

  const [isValidEthNetwork, setIsValidEthNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!isBscConnected && chain) {
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
  const isBnbConnected = useIsBnbConnected();
  const { chain } = useAccount();

  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [isValidBnbNetwork, setIsValidBnbNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!isBnbConnected) return;
    setIsValidBnbNetwork(isBnbNetworkValid(isMainnet, chain?.id));
  }, [isMainnet, isBnbConnected, chain]);

  return {
    isValidBnbNetwork,
  };
}
