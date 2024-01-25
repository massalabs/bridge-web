import { useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { useBridgeModeStore } from '@/store/store';
import { validateEvmNetwork } from '@/utils/network';

export function useWrongNetwork() {
  const { chain } = useNetwork();
  const { isMainnet } = useBridgeModeStore();

  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  useEffect(() => {
    setWrongNetwork(!validateEvmNetwork(isMainnet, chain?.id));
  }, [isMainnet, chain]);

  return {
    wrongNetwork,
  };
}
