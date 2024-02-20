import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { validateEvmNetwork, validateMassaNetwork } from '@/utils/network';

export function useWrongNetworkEVM() {
  const { chain } = useAccount();
  const { isMainnet: getIsMainnet } = useBridgeModeStore();
  const isMainnet = getIsMainnet();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnet, chain?.id));
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
