import { useEffect, useState } from 'react';
import { toast } from '@massalabs/react-ui-kit';

import { useAccount } from 'wagmi';
import { validateEvmNetwork, validateMassaNetwork } from '../../utils/network';
import { Blockchain } from '@/const';
import Intl from '@/i18n/i18n';
import { useAccountStore, useBridgeModeStore } from '@/store/store';

export function useNetworkCheck() {
  const { connectedNetwork, currentProvider } = useAccountStore();
  const { chain: evmConnectedChain, connector } = useAccount();
  const {
    isMainnet: getIsMainnet,
    currentMode,
    evmNetwork: getEvmNetwork,
    massaNetwork: getMassaNetwork,
  } = useBridgeModeStore();

  const isMainnet = getIsMainnet();
  const evmNetwork = getEvmNetwork();
  const massaNetwork = getMassaNetwork();

  // state to dismiss toast
  const [wrongNetwork, setWrongNetwork] = useState<boolean>(false);

  const [toastIdEvm, setToastIdEvm] = useState<string>('');
  const [toastIdMassa, setToastIdMassa] = useState<string>('');

  useEffect(() => {
    // if not wallet is detected, do not show toast
    // useful when switching between wallets
    if (!currentProvider) {
      toast.dismiss(toastIdMassa);
      return;
    }
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
            // TODO: extract logic
            name: connector?.name || Intl.t(`general.${Blockchain.UNKNOWN}`),
            network: evmNetwork.toLowerCase(),
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
            name: currentProvider
              ? Intl.t(`connect-wallet.${currentProvider.name()}`)
              : '',
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
    currentMode,
    evmConnectedChain,
    connectedNetwork,
    isMainnet,
    toastIdEvm,
    toastIdMassa,
    currentProvider,
    evmNetwork,
    massaNetwork,
    setToastIdEvm,
    setWrongNetwork,
    setToastIdMassa,
    connector?.name,
  ]);

  return { wrongNetwork };
}
