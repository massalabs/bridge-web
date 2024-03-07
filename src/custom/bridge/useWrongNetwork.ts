import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useIsBscConnected } from './useIsBscConnected';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import {
  validateBscNetwork,
  validateEvmNetwork,
  validateMassaNetwork,
} from '@/utils/network';

export function useWrongNetworkEVM() {
  const { chain } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();
  const isBscConnected = useIsBscConnected();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!isBscConnected && chain) {
      setWrongNetwork(!validateEvmNetwork(isMainnet, chain.id));
    }
  }, [isMainnet, chain]);

  return {
    wrongNetwork,
  };
}

export function useWrongNetworkMASSA() {
  const { connectedNetwork } = useAccountStore();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!connectedNetwork) return;
    setWrongNetwork(!validateMassaNetwork(isMainnet, connectedNetwork));
  }, [isMainnet, connectedNetwork]);

  return {
    wrongNetwork,
  };
}

export function useWrongNetworkBsc() {
  const isBscConnected = useIsBscConnected();
  const { chain } = useAccount();

  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!isBscConnected) return;
    setWrongNetwork(!validateBscNetwork(isMainnet, chain?.id));
  }, [isMainnet, isBscConnected, chain]);

  return {
    wrongNetwork,
  };
}
