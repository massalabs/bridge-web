import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { validateEvmNetwork, validateMassaNetwork } from '../../utils/network';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useNetworkCheck(
  setWrongNetwork: (value: boolean) => void,
): void {
  const { connectedNetwork, currentProvider } = useAccountStore();
  const { chain: evmConnectedChain } = useAccount();
  const [isMainnet, currentMode] = useBridgeModeStore((state) => [
    state.isMainnet,
    state.currentMode,
  ]);

  const massaNetwork = isMainnet
    ? Blockchain.MASSA_MAINNET
    : Blockchain.MASSA_BUILDNET;

  const evmNetwork = isMainnet
    ? Blockchain.EVM_MAINNET
    : Blockchain.EVM_TESTNET;

  // state to prevent toast re-render
  const [toastIdEvm, setToastIdEvm] = useState<string>('');
  const [toastIdMassa, setToastIdMassa] = useState<string>('');

  useEffect(() => {
    // If wrong network is detected, show a toast
    // in toast, show opposite of current network

    // Check and toast EVM
    let evmOk = false;
    if (
      evmConnectedChain &&
      !validateEvmNetwork(isMainnet, evmConnectedChain.id)
    ) {
      setToastIdEvm(
        toast.error(
          Intl.t('connect-wallet.wrong-chain', {
            name: 'evm',
            network: evmNetwork,
          }),
          { id: 'evm' },
        ),
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
          Intl.t('connect-wallet.wrong-chain', {
            name: 'massa',
            network: massaNetwork,
          }),
          {
            id: 'massa',
          },
        ),
      );

      setWrongNetwork(true);
    } else {
      toast.dismiss(toastIdMassa);
      massaOk = true;
    }

    setWrongNetwork(!massaOk || !evmOk);
  }, [
    evmConnectedChain,
    currentMode,
    connectedNetwork,
    isMainnet,
    setWrongNetwork,
    toastIdEvm,
    toastIdMassa,
    setToastIdEvm,
    setToastIdMassa,
    currentProvider,
  ]);
}
