import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';
import { useNetwork } from 'wagmi';

import { validateEvmNetwork, validateMassaNetwork } from '../../utils/network';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useNetworkCheck(
  setWrongNetwork: (value: boolean) => void,
): void {
  const { connectedNetwork } = useAccountStore();
  const { chain: evmConnectedChain } = useNetwork();
  const [isMainnet, currentMode] = useBridgeModeStore((state) => [
    state.isMainnet,
    state.currentMode,
  ]);

  const [toastIdEvm, setToastIdEvm] = useState<string>('');
  const [toastIdMassa, setToastIdMassa] = useState<string>('');

  useEffect(() => {
    // Check and toast EVM
    let evmOk = false;
    if (
      evmConnectedChain &&
      !validateEvmNetwork(isMainnet, evmConnectedChain.id)
    ) {
      setToastIdEvm(
        toast.error(Intl.t('connect-wallet.wrong-evm-chain'), { id: 'evm' }),
      );
      setWrongNetwork(true);
    } else {
      toast.dismiss(toastIdEvm);
      evmOk = true;
    }

    // Check and toast Massa
    let massaOk = false;
    if (
      connectedNetwork &&
      !validateMassaNetwork(isMainnet, connectedNetwork)
    ) {
      setToastIdMassa(
        toast.error(
          Intl.t('connect-wallet.wrong-massa-chain', { id: 'massa' }),
        ),
      );
      setWrongNetwork(true);
    } else {
      toast.dismiss(toastIdMassa);
      massaOk = true;
    }

    setWrongNetwork(!massaOk || !evmOk);
  }, [evmConnectedChain, currentMode, connectedNetwork]);
}
