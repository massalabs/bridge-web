import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';
import { useAccountStore, useBridgeModeStore } from '@/store/store';
import { validateEvmNetwork, validateMassaNetwork } from '@/utils/network';

export function useWrongNetworkEVM() {
  const { chain } = useAccount();
  const { isMainnet } = useBridgeModeStore();
  const isMainnetMode = isMainnet();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnetMode, chain?.id));
  }, [isMainnet, chain]);

  return {
    wrongNetwork,
  };
}

export function useWrongNetworkMASSA() {
  const { connectedNetwork } = useAccountStore();

  const { isMainnet } = useBridgeModeStore();

  const isMainnetMode = isMainnet();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    if (!connectedNetwork) return;
    setWrongNetwork(!validateMassaNetwork(isMainnetMode, connectedNetwork));
  }, [isMainnet, connectedNetwork]);

  return {
    wrongNetwork,
  };
}
